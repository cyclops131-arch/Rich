# 💸 The Stupidly Rich Tracker

A fun, funky, zero-dependency website that tracks the **top 20 richest humans on Earth**
and translates their obscene fortunes into comparisons an ordinary mortal can actually *feel*.

## ✨ What's inside

- **🏆 Leaderboard of Absurdity** — all 20 billionaires, ranked, with snarky one-liners.
- **🤯 The Reality Machine** — pick anyone and see 12 ridiculous comparisons:
  lifetimes of work, a stack of $100 bills taller than the trip to the Moon, pizzas to
  the Moon and back, winning the lottery every day for millennia, and more.
- **🛍️ The Spend-O-Matic** — slide the daily burn rate ($1k → $1B/day) and find out how
  many years it takes them to go broke. (Spoiler: a while.)
- **🧍 You vs. Them** — type your net worth and discover exactly how outclassed you are.

## 🚀 Run it

No build, no install, no npm. It's just HTML + CSS + vanilla JS.

```bash
# open it directly
open index.html        # macOS
xdg-open index.html    # Linux

# ...or serve it
python3 -m http.server 8000   # then visit http://localhost:8000
```

## 📁 Files

| File            | What it does                                            |
|-----------------|---------------------------------------------------------|
| `index.html`    | Page structure + Content-Security-Policy                |
| `style.css`     | The funky neon look                                     |
| `script.js`     | All the math, animations & comparisons (escapes output) |
| `data.js`       | Curated rich list + reference values (easy to tweak)    |
| `dataSource.js` | Secure data layer: fetch → **validate/sanitize** → fallback |
| `worker.js`     | Cloudflare Worker proxy (keeps your API key server-side) |
| `.htaccess`     | Apache/GoDaddy security headers + forced HTTPS          |

## 🔄 Live data (accurate, updated numbers)

The site ships with **curated data** so it works instantly, offline, anywhere.
To pull live numbers:

> ⚠️ **Reality check:** there is **no official, free, real-time billionaire-wealth API**.
> Forbes/Bloomberg have the data but no free public API, and their internal endpoints
> block browsers (CORS) and aren't licensed for reuse. So you plug in a provider you choose.

**The secure way (recommended):** deploy `worker.js` to Cloudflare Workers (free).
It holds your provider's API key **server-side**, validates + caches the data, and
returns clean CORS-enabled JSON. Then set `API_URL` in `dataSource.js` to your Worker URL.
See the step-by-step header comment in `worker.js`.

Whatever the source, `dataSource.js` **strictly validates every record** (type, sane
worth bounds, length limits, tag-stripping) and **falls back to curated data** if the
feed is missing, slow, malformed, or tampered with — the site can never break or be
poisoned by a bad feed. Hit the **🔄 Refresh** button to re-fetch.

## 🔒 Security (tamper-proofing on shared hosting like GoDaddy)

> "People should not be able to trick with data or content."

Defenses, layered:

1. **Content-Security-Policy** (`index.html` meta + `.htaccess` header) — `script-src 'self'`
   blocks injected/inline scripts; sources are locked to your origin + the fonts CDN.
2. **Output escaping** — every dynamic value is HTML-escaped before it touches the DOM,
   so even a compromised feed can't inject `<script>`.
3. **Input/feed validation & sanitization** — `dataSource.js` rejects junk and strips
   `<`/`>` from all incoming strings.
4. **Immutable data** — records are `Object.freeze`-d so other code can't mutate them.
5. **`.htaccess`** — forces HTTPS, adds `X-Content-Type-Options`, `X-Frame-Options`,
   `Referrer-Policy`, `Permissions-Policy`, HSTS; hides server banners; blocks directory
   listing and serving of source/config files.

> 📌 If you enable a live API on a **different** host, add that host to `connect-src`
> in **both** `index.html` (the CSP `<meta>`) and `.htaccess`. A same-origin `/api`
> proxy needs no change.
>
> Note: a static host can't stop someone who *compromises the hosting account itself*
> from editing files — keep your GoDaddy/cPanel credentials strong and 2FA on. These
> measures stop everything an attacker can do *from the browser side*.

## ⚠️ Disclaimer

Net worth figures are **approximate, illustrative, and for entertainment only** — they
wobble daily with the stock market. Not financial advice. The billionaires, sadly, are real.
