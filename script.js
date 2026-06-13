/* ===========================================================
   💸 THE STUPIDLY RICH TRACKER — the brains
   =========================================================== */

const R = REFERENCES;

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
function countUp(el, target, fmt, dur = 1200) {
  const start = performance.now();
  const from = 0;
  function frame(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (target - from) * eased);
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
  RICH_LIST.forEach((p) => {
    const card = document.createElement("button");
    card.className = "rich-card";
    card.innerHTML = `
      <span class="rc-rank">${p.rank}</span>
      <span class="rc-emoji">${p.emoji}</span>
      <span class="rc-info">
        <span class="rc-name">${p.name} ${p.country}</span>
        <span class="rc-company">${p.company}</span>
        <span class="rc-quip">"${p.quip}"</span>
      </span>
      <span class="rc-worth">${moneyShort(p.worth)}<small>net worth</small></span>
    `;
    card.addEventListener("click", () => {
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
  const total = RICH_LIST.reduce((s, p) => s + p.worth, 0);
  countUp(document.getElementById("combined-worth"), total, money, 1800);
}

/* ===========================================================
   THE REALITY MACHINE — crazy comparisons
   =========================================================== */
function comparisonsFor(worth, name) {
  const out = [];
  const add = (emoji, num, label, sub) => out.push({ emoji, num, label, sub });

  // 1. Years of work at median salary
  const lifetimes = worth / R.medianSalaryUSA / R.avgLifespanYears;
  add("⏳", commas(worth / R.medianSalaryUSA) + " yrs",
    `of work at the median salary (${money(R.medianSalaryUSA)}/yr)`,
    `That's ${commas(lifetimes)} entire human lifetimes of working. Every. Single. One.`);

  // 2. $1/second counting
  const yearsCounting = worth / R.secondsToCountOne / 60 / 60 / 24 / 365;
  add("🔢", commas(yearsCounting) + " yrs",
    `to count it at $1 per second, 24/7, no sleep`,
    `The pyramids are only ~4,600 years old. This makes them look brand new.`);

  // 3. Stack of $100 bills height
  const stackKm = (worth / 100) * R.bill100Thickness_m / 1000;
  let stackCompare;
  if (stackKm * 1000 > R.moonDistance_m) stackCompare = `That's ${(stackKm * 1000 / R.moonDistance_m).toFixed(1)}× the distance to the MOON. 🌝`;
  else if (stackKm * 1000 > R.issAltitude_m) stackCompare = `That blows past the Space Station (${(stackKm * 1000 / R.issAltitude_m).toFixed(0)}× higher). 🛰️`;
  else stackCompare = `Mt Everest (8.8km) is a speed bump by comparison.`;
  add("🏔️", commas(stackKm) + " km",
    `tall if stacked in $100 bills`,
    stackCompare);

  // 4. Bills laid end to end -> trips around Earth
  const lengthM = (worth / 100) * R.bill100Length_m;
  const aroundEarth = lengthM / 40_075_000;
  add("🌍", commas(aroundEarth) + "×",
    `around the Earth if you laid the $100 bills end-to-end`,
    `Total length: ${commas(lengthM / 1000)} km of pure cash highway.`);

  // 5. Houses
  add("🏠", commas(worth / R.housePriceUSA),
    `median US homes (${money(R.housePriceUSA)} each)`,
    `Enough to house a city. Or just leave them empty, billionaire-style.`);

  // 6. Coffees
  add("☕", bigNum(worth / R.coffeePrice),
    `fancy $${R.coffeePrice} lattes`,
    `One every day, it would last ${commas(worth / R.coffeePrice / 365)} years. Stay caffeinated.`);

  // 7. iPhones
  add("📱", bigNum(worth / R.iphonePrice),
    `brand-new $${commas(R.iphonePrice)} phones`,
    `That's ${(worth / R.iphonePrice / 8.1e9).toFixed(1)} phones for every human on Earth.`);

  // 8. Private jets
  add("🛩️", commas(worth / R.privateJetPrice),
    `private jets ($65M each)`,
    `A personal airline. The carbon footprint of a small moon.`);

  // 9. Pizzas
  add("🍕", bigNum(worth / R.pizzaPrice),
    `large pizzas`,
    `Stacked in boxes, they'd reach the Moon and back. Pepperoni optional.`);

  // 10. Win the lottery every day
  const lottoYears = worth / R.lottoJackpot / 365;
  add("🎰", commas(lottoYears) + " yrs",
    `of winning a $1,000,000 jackpot EVERY day`,
    `Imagine being "set for life" 365 times a year for ${commas(lottoYears)} years.`);

  // 11. If you earned $100k/year since the dinosaurs
  const yearsAt100k = worth / 100_000;
  add("🦖", commas(yearsAt100k) + " yrs",
    `of earning $100k/year to match this`,
    yearsAt100k > 66_000_000
      ? `You'd have had to start before the dinosaurs went extinct.`
      : `You'd need to start roughly ${commas(yearsAt100k)} years ago. Got a time machine?`);

  // 12. Seconds in human terms (the famous one)
  const millionSeconds = 1e6;       // ~11.5 days
  const ratio = worth / 1e6;
  add("🤔", commas(ratio / 86400 / 365) + " yrs",
    `if each dollar were 1 second`,
    `$1 million = ~11.5 days. This fortune = ${commas(ratio / 86400 / 365)} years. Let that sink in.`);

  return out;
}

let currentPerson = RICH_LIST[0];

function selectPerson(rank) {
  const p = RICH_LIST.find((x) => x.rank === rank) || RICH_LIST[0];
  currentPerson = p;
  document.getElementById("person-select").value = String(p.rank);
  document.getElementById("selected-name").textContent = `${p.emoji} ${p.name}`;
  countUp(document.getElementById("selected-worth"), p.worth, money, 900);

  const grid = document.getElementById("comparisons");
  grid.innerHTML = "";
  comparisonsFor(p.worth, p.name).forEach((c, i) => {
    const card = document.createElement("div");
    card.className = "comp-card";
    card.style.animationDelay = i * 0.05 + "s";
    card.innerHTML = `
      <div class="comp-emoji">${c.emoji}</div>
      <div class="comp-num">${c.num}</div>
      <div class="comp-label">${c.label}</div>
      <div class="comp-sub">${c.sub}</div>
    `;
    grid.appendChild(card);
  });

  // keep spend-o-matic + you-vs-them in sync
  document.getElementById("spend-name").textContent = p.name;
  updateSpend();
}

function buildSelects() {
  const opts = RICH_LIST.map((p) => `<option value="${p.rank}">#${p.rank} — ${p.name} (${moneyShort(p.worth)})</option>`).join("");
  document.getElementById("person-select").innerHTML = opts;
  document.getElementById("vs-select").innerHTML = opts;
  document.getElementById("person-select").addEventListener("change", (e) => selectPerson(Number(e.target.value)));
  document.getElementById("vs-select").addEventListener("change", updateYouVsThem);
}

/* ===========================================================
   SPEND-O-MATIC
   =========================================================== */
function sliderToAmount(v) {
  // slider 3..9 maps to $1,000 .. $1,000,000,000 (log scale)
  return Math.round(Math.pow(10, v));
}
function describeDuration(years) {
  if (years < 1) return commas(years * 365) + " days";
  if (years < 1000) return commas(years) + " years";
  return commas(years) + " years";
}
function spendFlavor(years) {
  if (years < 1) return "Blink and it's gone. Even billionaires can speedrun bankruptcy. 💀";
  if (years < 10) return "A whole decade-ish of insane spending. Rookie numbers, honestly.";
  if (years < 100) return "Longer than most people are alive. And they'd STILL have change.";
  if (years < 1000) return "You'd die of old age many times over before the money ran out. 🪦";
  if (years < 100000) return "Civilizations would rise and fall. The money? Still there. 🏛️";
  return "The sun will be noticeably older by the time this runs out. ☀️";
}
function updateSpend() {
  const slider = document.getElementById("spend-slider");
  const amt = sliderToAmount(parseFloat(slider.value));
  document.getElementById("spend-rate").textContent = "$" + commas(amt);
  // sync preset highlight
  document.querySelectorAll(".spend-presets button").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.amt) === amt);
  });
  const years = currentPerson.worth / amt / 365;
  document.getElementById("spend-years").textContent = describeDuration(years);
  document.getElementById("spend-flavor").textContent = spendFlavor(years);
}
function setupSpend() {
  document.getElementById("spend-slider").addEventListener("input", updateSpend);
  document.querySelectorAll(".spend-presets button").forEach((b) => {
    b.addEventListener("click", () => {
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
  const p = RICH_LIST.find((x) => x.rank === rank) || RICH_LIST[0];
  const el = document.getElementById("you-result");

  if (you <= 0) {
    el.innerHTML = `Type a number above to see how spectacularly outclassed you are. 😅`;
    return;
  }

  const ratio = p.worth / you;
  // What fraction of a second is YOUR money to them, if their fortune = avg lifespan?
  const yourTimeOfTheirLife = (you / p.worth) * R.avgLifespanYears * 365 * 24 * 60 * 60; // seconds
  let lifeBit;
  if (yourTimeOfTheirLife < 1) lifeBit = `${(yourTimeOfTheirLife * 1000).toFixed(1)} milliseconds`;
  else if (yourTimeOfTheirLife < 60) lifeBit = `${yourTimeOfTheirLife.toFixed(1)} seconds`;
  else if (yourTimeOfTheirLife < 3600) lifeBit = `${(yourTimeOfTheirLife / 60).toFixed(1)} minutes`;
  else if (yourTimeOfTheirLife < 86400) lifeBit = `${(yourTimeOfTheirLife / 3600).toFixed(1)} hours`;
  else lifeBit = `${(yourTimeOfTheirLife / 86400).toFixed(1)} days`;

  // How fast do they "earn" your entire net worth? (assume 10% annual return on their pile)
  const theirPerSecond = (p.worth * 0.10) / (365 * 24 * 60 * 60);
  const secsToMakeYou = you / theirPerSecond;
  let earnBit;
  if (secsToMakeYou < 1) earnBit = `${(secsToMakeYou * 1000).toFixed(0)} milliseconds`;
  else if (secsToMakeYou < 60) earnBit = `${secsToMakeYou.toFixed(1)} seconds`;
  else if (secsToMakeYou < 3600) earnBit = `${(secsToMakeYou / 60).toFixed(1)} minutes`;
  else earnBit = `${(secsToMakeYou / 3600).toFixed(1)} hours`;

  el.innerHTML = `
    <p>${p.emoji} <strong>${p.name}</strong> has</p>
    <span class="big">${commas(ratio)}× your money</span>
    <p>If their entire fortune were one ${R.avgLifespanYears}-year lifetime,
       your net worth would be just <span class="punch">${lifeBit}</span> of it. 😬</p>
    <p style="margin-top:1rem">Just earning ~10% interest on their pile, they "make" your <em>entire net worth</em>
       in about <span class="punch">${earnBit}</span>. While doing literally nothing. 🛋️</p>
  `;
}
function setupYouVsThem() {
  document.getElementById("your-worth").addEventListener("input", updateYouVsThem);
}

/* ===========================================================
   INIT
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  startMoneyRain();
  buildLeaderboard();
  buildSelects();
  showCombined();
  setupSpend();
  setupYouVsThem();
  selectPerson(1);
  updateYouVsThem();
});
