/* ===========================================================
   💸 THE STUPIDLY RICH TRACKER — the brains
   =========================================================== */

const R = REFERENCES;
let PEOPLE = [];               // populated from the (validated) data layer
let currentPerson = null;

/* ---------- security: escape anything that lands in innerHTML ---------- */
const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ESC_MAP[c]; }); }

/* ---------- formatting helpers ---------- */
function money(n) {
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + " trillion";
  if (n >= 1e9)  return "$" + (n / 1e9).toFixed(1) + " billion";
  if (n >= 1e6)  return "$" + (n / 1e6).toFixed(1) + " million";
  return "$" + Math.round(n).toLocaleString();
}
function moneyShort(n) {
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6)  return "$" + (n / 1e6).toFixed(1) + "M";
  return "$" + Math.round(n).toLocaleString();
}
function bigNum(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + " trillion";
  if (n >= 1e9)  return (n / 1e9).toFixed(1) + " billion";
  if (n >= 1e6)  return (n / 1e6).toFixed(1) + " million";
  if (n >= 1e3)  return Math.round(n).toLocaleString();
  return n.toFixed(1);
}
function commas(n) { return Math.round(n).toLocaleString(); }

/* ---------- animated count-up ---------- */
function countUp(el, target, fmt, dur) {
  dur = dur || 1200;
  const start = performance.now();
  function frame(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ===========================================================
   MONEY RAIN
   =========================================================== */
function startMoneyRain() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rain = document.getElementById("money-rain");
  const emojis = ["💵", "💰", "🤑", "💸", "🪙", "💎"];
  for (let i = 0; i < 26; i++) {
    const drop = document.createElement("div");
    drop.className = "money-drop";
    drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    drop.style.left = Math.random() * 100 + "%";
    drop.style.animationDuration = 6 + Math.random() * 9 + "s";
    drop.style.animationDelay = -Math.random() * 12 + "s";
    drop.style.fontSize = 1 + Math.random() * 1.8 + "rem";
    rain.appendChild(drop);
  }
}

/* ===========================================================
   LEADERBOARD
   =========================================================== */
function buildLeaderboard() {
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";
  PEOPLE.forEach(function (p) {
    const card = document.createElement("button");
    card.className = "rich-card";
    card.innerHTML =
      '<span class="rc-rank">' + p.rank + '</span>' +
      '<span class="rc-emoji">' + esc(p.emoji) + '</span>' +
      '<span class="rc-info">' +
        '<span class="rc-name">' + esc(p.name) + ' ' + esc(p.country) + '</span>' +
        '<span class="rc-company">' + esc(p.company) + '</span>' +
        '<span class="rc-quip">"' + esc(p.quip) + '"</span>' +
      '</span>' +
      '<span class="rc-worth">' + esc(moneyShort(p.worth)) + '<small>net worth</small></span>';
    card.addEventListener("click", function () {
      selectPerson(p.rank);
      document.getElementById("reality").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    board.appendChild(card);
  });
}

/* ===========================================================
   COMBINED WORTH
   =========================================================== */
function showCombined() {
  const total = PEOPLE.reduce(function (s, p) { return s + p.worth; }, 0);
  countUp(document.getElementById("combined-worth"), total, money, 1800);
}

/* ===========================================================
   THE REALITY MACHINE — crazy comparisons
   =========================================================== */
function comparisonsFor(worth) {
  const out = [];
  const add = function (emoji, num, label, sub) { out.push({ emoji: emoji, num: num, label: label, sub: sub }); };

  const lifetimes = worth / R.medianSalaryUSA / R.avgLifespanYears;
  add("⏳", commas(worth / R.medianSalaryUSA) + " yrs",
    "of work at the median salary (" + money(R.medianSalaryUSA) + "/yr)",
    "That's " + commas(lifetimes) + " entire human lifetimes of working. Every. Single. One.");

  const yearsCounting = worth / R.secondsToCountOne / 60 / 60 / 24 / 365;
  add("🔢", commas(yearsCounting) + " yrs",
    "to count it at $1 per second, 24/7, no sleep",
    "The pyramids are only ~4,600 years old. This makes them look brand new.");

  const stackKm = (worth / 100) * R.bill100Thickness_m / 1000;
  let stackCompare;
  if (stackKm * 1000 > R.moonDistance_m) stackCompare = "That's " + (stackKm * 1000 / R.moonDistance_m).toFixed(1) + "× the distance to the MOON. 🌝";
  else if (stackKm * 1000 > R.issAltitude_m) stackCompare = "That blows past the Space Station (" + (stackKm * 1000 / R.issAltitude_m).toFixed(0) + "× higher). 🛰️";
  else stackCompare = "Mt Everest (8.8km) is a speed bump by comparison.";
  add("🏔️", commas(stackKm) + " km", "tall if stacked in $100 bills", stackCompare);

  const lengthM = (worth / 100) * R.bill100Length_m;
  const aroundEarth = lengthM / 40075000;
  add("🌍", commas(aroundEarth) + "×",
    "around the Earth if you laid the $100 bills end-to-end",
    "Total length: " + commas(lengthM / 1000) + " km of pure cash highway.");

  add("🏠", commas(worth / R.housePriceUSA),
    "median US homes (" + money(R.housePriceUSA) + " each)",
    "Enough to house a city. Or just leave them empty, billionaire-style.");

  add("☕", bigNum(worth / R.coffeePrice),
    "fancy $" + R.coffeePrice + " lattes",
    "One every day, it would last " + commas(worth / R.coffeePrice / 365) + " years. Stay caffeinated.");

  add("📱", bigNum(worth / R.iphonePrice),
    "brand-new $" + commas(R.iphonePrice) + " phones",
    "That's " + (worth / R.iphonePrice / 8.1e9).toFixed(1) + " phones for every human on Earth.");

  add("🛩️", commas(worth / R.privateJetPrice),
    "private jets ($65M each)",
    "A personal airline. The carbon footprint of a small moon.");

  add("🍕", bigNum(worth / R.pizzaPrice),
    "large pizzas",
    "Stacked in boxes, they'd reach the Moon and back. Pepperoni optional.");

  const lottoYears = worth / R.lottoJackpot / 365;
  add("🎰", commas(lottoYears) + " yrs",
    "of winning a $1,000,000 jackpot EVERY day",
    "Imagine being \"set for life\" 365 times a year for " + commas(lottoYears) + " years.");

  const yearsAt100k = worth / 100000;
  add("🦖", commas(yearsAt100k) + " yrs",
    "of earning $100k/year to match this",
    yearsAt100k > 66000000
      ? "You'd have had to start before the dinosaurs went extinct."
      : "You'd need to start roughly " + commas(yearsAt100k) + " years ago. Got a time machine?");

  const perPerson = worth / 8.1e9; // every human alive
  add("🌐", "$" + commas(perPerson),
    "handed to EVERY human on Earth (all 8.1 billion of us)",
    "One person could gift the entire planet $" + commas(perPerson) + " each. Try not to spend it all at once.");

  return out;
}

function selectPerson(rank) {
  const p = PEOPLE.find(function (x) { return x.rank === rank; }) || PEOPLE[0];
  currentPerson = p;
  document.getElementById("person-select").value = String(p.rank);
  document.getElementById("selected-name").textContent = p.emoji + " " + p.name;
  countUp(document.getElementById("selected-worth"), p.worth, money, 900);

  const grid = document.getElementById("comparisons");
  grid.innerHTML = "";
  comparisonsFor(p.worth).forEach(function (c, i) {
    const card = document.createElement("div");
    card.className = "comp-card";
    card.style.animationDelay = i * 0.05 + "s";
    card.innerHTML =
      '<div class="comp-emoji">' + esc(c.emoji) + '</div>' +
      '<div class="comp-num">' + esc(c.num) + '</div>' +
      '<div class="comp-label">' + esc(c.label) + '</div>' +
      '<div class="comp-sub">' + esc(c.sub) + '</div>';
    grid.appendChild(card);
  });

  document.getElementById("spend-name").textContent = p.name;
  updateSpend();
}

function buildSelects() {
  const opts = PEOPLE.map(function (p) {
    return '<option value="' + p.rank + '">#' + p.rank + ' — ' + esc(p.name) + ' (' + esc(moneyShort(p.worth)) + ')</option>';
  }).join("");
  document.getElementById("person-select").innerHTML = opts;
  document.getElementById("vs-select").innerHTML = opts;
  document.getElementById("person-select").addEventListener("change", function (e) { selectPerson(Number(e.target.value)); });
  document.getElementById("vs-select").addEventListener("change", updateYouVsThem);
}

/* ===========================================================
   SPEND-O-MATIC
   =========================================================== */
function sliderToAmount(v) { return Math.round(Math.pow(10, v)); }
function describeDuration(years) {
  if (years < 1) return commas(years * 365) + " days";
  return commas(years) + " years";
}
function spendFlavor(years) {
  if (years < 1) return "Blink and it's gone. Even billionaires can speedrun bankruptcy. 💀";
  if (years < 10) return "A decade-ish of unhinged spending. Rookie numbers, honestly.";
  if (years < 40) return "Decades of relentless splurging — and they'd STILL have loads left. 🤷";
  if (years < 100) return "Nearly a whole lifetime of max spending. They'd die with change to spare.";
  if (years < 1000) return "You'd die of old age many times over before the money ran out. 🪦";
  if (years < 100000) return "Civilizations would rise and fall. The money? Still there. 🏛️";
  return "The sun will be noticeably older by the time this runs out. ☀️";
}
function updateSpend() {
  if (!currentPerson) return;
  const slider = document.getElementById("spend-slider");
  const amt = sliderToAmount(parseFloat(slider.value));
  document.getElementById("spend-rate").textContent = "$" + commas(amt);
  document.querySelectorAll(".spend-presets button").forEach(function (b) {
    b.classList.toggle("active", Number(b.dataset.amt) === amt);
  });
  const years = currentPerson.worth / amt / 365;
  document.getElementById("spend-years").textContent = describeDuration(years);
  document.getElementById("spend-flavor").textContent = spendFlavor(years);
}
function setupSpend() {
  document.getElementById("spend-slider").addEventListener("input", updateSpend);
  document.querySelectorAll(".spend-presets button").forEach(function (b) {
    b.addEventListener("click", function () {
      const amt = Number(b.dataset.amt);
      document.getElementById("spend-slider").value = Math.log10(amt);
      updateSpend();
    });
  });
}

/* ===========================================================
   YOU vs THEM
   =========================================================== */
function updateYouVsThem() {
  const you = Math.max(0, Number(document.getElementById("your-worth").value) || 0);
  const rank = Number(document.getElementById("vs-select").value);
  const p = PEOPLE.find(function (x) { return x.rank === rank; }) || PEOPLE[0];
  const el = document.getElementById("you-result");

  if (you <= 0) {
    el.textContent = "Type a number above to see how spectacularly outclassed you are. 😅";
    return;
  }

  const ratio = p.worth / you;
  const yourTimeOfTheirLife = (you / p.worth) * R.avgLifespanYears * 365 * 24 * 60 * 60;
  let lifeBit;
  if (yourTimeOfTheirLife < 1) lifeBit = (yourTimeOfTheirLife * 1000).toFixed(1) + " milliseconds";
  else if (yourTimeOfTheirLife < 60) lifeBit = yourTimeOfTheirLife.toFixed(1) + " seconds";
  else if (yourTimeOfTheirLife < 3600) lifeBit = (yourTimeOfTheirLife / 60).toFixed(1) + " minutes";
  else if (yourTimeOfTheirLife < 86400) lifeBit = (yourTimeOfTheirLife / 3600).toFixed(1) + " hours";
  else lifeBit = (yourTimeOfTheirLife / 86400).toFixed(1) + " days";

  const theirPerSecond = (p.worth * 0.10) / (365 * 24 * 60 * 60);
  const secsToMakeYou = you / theirPerSecond;
  let earnBit;
  if (secsToMakeYou < 1) earnBit = (secsToMakeYou * 1000).toFixed(0) + " milliseconds";
  else if (secsToMakeYou < 60) earnBit = secsToMakeYou.toFixed(1) + " seconds";
  else if (secsToMakeYou < 3600) earnBit = (secsToMakeYou / 60).toFixed(1) + " minutes";
  else earnBit = (secsToMakeYou / 3600).toFixed(1) + " hours";

  el.innerHTML =
    '<p>' + esc(p.emoji) + ' <strong>' + esc(p.name) + '</strong> has</p>' +
    '<span class="big">' + esc(commas(ratio)) + '× your money</span>' +
    '<p>If their entire fortune were one ' + R.avgLifespanYears + '-year lifetime, ' +
      'your net worth would be just <span class="punch">' + esc(lifeBit) + '</span> of it. 😬</p>' +
    '<p class="vs-gap">Just earning ~10% interest on their pile, they "make" your <em>entire net worth</em> ' +
      'in about <span class="punch">' + esc(earnBit) + '</span>. While doing literally nothing. 🛋️</p>';
}
function setupYouVsThem() {
  document.getElementById("your-worth").addEventListener("input", updateYouVsThem);
}

/* ===========================================================
   DATA STATUS INDICATOR
   =========================================================== */
function updateStatus(meta) {
  const el = document.getElementById("data-status");
  if (!el) return;
  let txt;
  var asOf = (typeof DATA_AS_OF !== "undefined") ? DATA_AS_OF : "Curated data";
  if (meta.source === "live") txt = "🟢 Live data" + (meta.updatedAt ? " · updated " + esc(meta.updatedAt) : "");
  else if (meta.source === "fallback") txt = "🟡 Live source down — showing " + esc(asOf);
  else txt = "📦 " + esc(asOf);
  el.querySelector(".data-status-text").innerHTML = txt;
}

/* ===========================================================
   INIT
   =========================================================== */
function render() {
  buildLeaderboard();
  buildSelects();
  showCombined();
  selectPerson(PEOPLE[0].rank);
  updateYouVsThem();
}

function loadAndRender() {
  const btn = document.getElementById("refresh-btn");
  if (btn) btn.disabled = true;
  return RichData.load().then(function (meta) {
    PEOPLE = meta.people;
    render();
    updateStatus(meta);
  }).finally(function () {
    if (btn) btn.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  startMoneyRain();
  setupSpend();
  setupYouVsThem();
  const btn = document.getElementById("refresh-btn");
  if (btn) btn.addEventListener("click", loadAndRender);
  loadAndRender();
});
