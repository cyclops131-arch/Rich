/* ============================================================
   💸 RICH TRACKER — secure live-data proxy (Cloudflare Worker)
   ------------------------------------------------------------
   WHY THIS EXISTS
   A static site (GoDaddy, etc.) can't safely hold an API key —
   anything in the page is public. This tiny FREE Cloudflare Worker
   sits between your site and the paid/keyed data provider:

     browser  ──▶  this Worker (holds the secret key)  ──▶  provider
                   validates + caches + adds CORS

   The browser never sees the key. The Worker only ever returns
   clean, validated JSON.

   DEPLOY (free tier is plenty):
     1. npm i -g wrangler && wrangler login
     2. wrangler deploy worker.js --name rich-tracker-api
     3. wrangler secret put DATA_API_KEY        (paste your provider key)
     4. Set ALLOWED_ORIGIN below to your real site, e.g.
        https://www.yourdomain.com
     5. In dataSource.js set API_URL to your Worker URL, e.g.
        https://rich-tracker-api.<you>.workers.dev
        and add that host to connect-src in index.html + .htaccess.

   ADAPT TO YOUR PROVIDER:
   Edit UPSTREAM_URL and mapProvider() to match whatever data source
   you license. There is NO official free real-time billionaire API,
   so plug in the provider you choose.
   ============================================================ */

const ALLOWED_ORIGIN = "https://www.yourdomain.com"; // <-- set to your site
const UPSTREAM_URL = "https://api.example.com/v1/billionaires?limit=20"; // <-- your provider
const CACHE_SECONDS = 600; // serve cached data for 10 min (be kind to your quota)

const MIN_WORTH = 1e8, MAX_WORTH = 5e12, STR_MAX = 80;

function clampStr(v, max) {
  if (typeof v !== "string") return "";
  return v.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max || STR_MAX);
}

// Map ONE provider record -> our shape. Adjust the field names to your API.
function mapProvider(item, i) {
  const worth = Number(item.netWorth ?? item.worth ?? item.net_worth);
  if (!Number.isFinite(worth) || worth < MIN_WORTH || worth > MAX_WORTH) return null;
  const name = clampStr(item.name ?? item.fullName);
  if (!name) return null;
  return {
    rank: Number.isInteger(item.rank) ? item.rank : i + 1,
    name: name,
    worth: worth,
    emoji: clampStr(item.emoji, 8) || "🤑",
    company: clampStr(item.company ?? item.source) || "Mystery Money Inc.",
    country: clampStr(item.countryFlag ?? item.country, 8) || "🏳️",
    quip: clampStr(item.quip, 140) || "Suspiciously wealthy.",
  };
}

function corsHeaders(origin) {
  const allow = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: cors });

    // edge cache
    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).origin + "/rich-data", request);
    let cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { headers: { ...cors, "Content-Type": "application/json", "X-Cache": "HIT" } });
    }

    try {
      const upstream = await fetch(UPSTREAM_URL, {
        headers: { "Authorization": "Bearer " + env.DATA_API_KEY, "Accept": "application/json" },
        cf: { cacheTtl: CACHE_SECONDS },
      });
      if (!upstream.ok) throw new Error("upstream HTTP " + upstream.status);

      const raw = await upstream.json();
      const arr = Array.isArray(raw) ? raw : (raw.data || raw.results || []);
      const people = arr.map(mapProvider).filter(Boolean)
        .sort((a, b) => b.worth - a.worth)
        .slice(0, 20)
        .map((p, i) => ({ ...p, rank: i + 1 }));

      if (people.length < 3) throw new Error("too few valid records");

      const payload = JSON.stringify({ updatedAt: new Date().toISOString(), data: people });
      const res = new Response(payload, {
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=" + CACHE_SECONDS,
          "X-Cache": "MISS",
        },
      });
      ctx.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    } catch (err) {
      // never leak internals; the site will fall back to its curated data
      return new Response(JSON.stringify({ error: "data unavailable" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
  },
};
