/* ===========================================================
   💸 RICH TRACKER — secure data layer
   -----------------------------------------------------------
   - Optionally fetches LIVE data from a configurable HTTPS endpoint.
   - STRICTLY validates + sanitizes every record (defends against a
     compromised / spoofed feed injecting junk or scripts).
   - Always falls back to the bundled, curated data so the site can
     never be left broken or blank.
   - Exposes only a frozen, read-only API on window.RichData.
   =========================================================== */
(function (global) {
  "use strict";

  const CONFIG = {
    // ── PLUG IN LIVE DATA HERE ──────────────────────────────
    // Leave "" to use the bundled curated data (safe default, works anywhere,
    // including plain GoDaddy static hosting with NO backend).
    //
    // To go live, point this at an HTTPS, CORS-enabled endpoint that returns
    // JSON shaped like the bundled RICH_LIST (see worker.js for a ready-made,
    // key-safe proxy you can deploy free on Cloudflare Workers).
    // If you use an external host, also add it to connect-src in your CSP
    // (index.html <meta> and .htaccess).
    API_URL: "",
    TIMEOUT_MS: 6000,
    MAX_PEOPLE: 20,
  };

  // sanity bounds — anything outside these is treated as a bad/forged record
  const MIN_WORTH = 1e8;   // $100M floor
  const MAX_WORTH = 5e12;  // $5T ceiling (no human is close; rejects absurd values)
  const STR_MAX = 80;

  function sanitizeString(v, max) {
    if (typeof v !== "string") return "";
    // strip tag/entity starters, collapse whitespace, clamp length
    return v.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max || STR_MAX);
  }
  function num(v) {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : NaN;
  }

  function validatePerson(p, i) {
    if (!p || typeof p !== "object") return null;
    const worth = num(p.worth);
    if (!Number.isFinite(worth) || worth < MIN_WORTH || worth > MAX_WORTH) return null;
    const name = sanitizeString(p.name);
    if (!name) return null;
    let rank = num(p.rank);
    if (!Number.isInteger(rank) || rank < 1 || rank > 100) rank = i + 1;
    return {
      rank: rank,
      name: name,
      worth: worth,
      emoji: sanitizeString(p.emoji, 8) || "🤑",
      company: sanitizeString(p.company) || "Mystery Money Inc.",
      country: sanitizeString(p.country, 8) || "🏳️",
      quip: sanitizeString(p.quip, 140) || "Suspiciously wealthy.",
    };
  }

  function validateList(raw) {
    const arr = Array.isArray(raw) ? raw
      : (raw && Array.isArray(raw.data) ? raw.data : null);
    if (!arr) throw new Error("payload is not an array");
    const clean = arr
      .map(validatePerson)
      .filter(Boolean)
      .sort(function (a, b) { return b.worth - a.worth; })
      .slice(0, CONFIG.MAX_PEOPLE)
      .map(function (p, i) {
        p.rank = i + 1;            // re-rank by validated worth
        return Object.freeze(p);   // make each record immutable
      });
    if (clean.length < 3) throw new Error("too few valid records (" + clean.length + ")");
    return Object.freeze(clean);
  }

  function fetchRemote(url) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, CONFIG.TIMEOUT_MS);
    return fetch(url, {
      signal: ctrl.signal,
      mode: "cors",
      credentials: "omit",   // never send cookies/creds to a third party
      cache: "no-store",
      redirect: "error",     // refuse sneaky redirects
      headers: { "Accept": "application/json" },
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      var ct = res.headers.get("content-type") || "";
      if (!/json/i.test(ct)) throw new Error("non-JSON response");
      return res.json();
    }).finally(function () { clearTimeout(timer); });
  }

  function bundled() {
    return validateList(typeof RICH_LIST !== "undefined" ? RICH_LIST : []);
  }

  function load() {
    var fallback = bundled();
    if (!CONFIG.API_URL) {
      return Promise.resolve({ people: fallback, source: "bundled", updatedAt: null });
    }
    return fetchRemote(CONFIG.API_URL).then(function (raw) {
      var people = validateList(raw && raw.data ? raw.data : raw);
      var updatedAt = (raw && raw.updatedAt)
        ? sanitizeString(String(raw.updatedAt), 40)
        : new Date().toISOString();
      return { people: people, source: "live", updatedAt: updatedAt };
    }).catch(function (e) {
      // any failure -> safe, curated data. The site never breaks.
      if (global.console) console.warn("[RichTracker] live data unavailable, using curated data:", e.message);
      return { people: fallback, source: "fallback", updatedAt: null, error: e.message };
    });
  }

  global.RichData = Object.freeze({
    load: load,
    CONFIG: Object.freeze({
      API_URL: CONFIG.API_URL,
      MAX_PEOPLE: CONFIG.MAX_PEOPLE,
    }),
  });
})(window);
