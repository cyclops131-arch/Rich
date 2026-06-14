// 💰 Top 20 Richest Humans on Planet Earth 💰
// Source: Forbes 2026 World's Billionaires List (snapshot ~March 2026).
//   • Ranks 1-10  -> verified Forbes 2026 figures.
//   • Ranks 11-20 -> approximate (sources disagree between Forbes annual,
//                    Forbes Real-Time, and Bloomberg). Easy to fine-tune below.
// Real-time values wobble daily; these are a recent snapshot, not live. For fun, not advice.
// Numbers in USD.
const DATA_AS_OF = "Forbes 2026 list · ~March 2026";

const RICH_LIST = [
  { rank: 1,  name: "Elon Musk",                  emoji: "🚀", worth: 839_000_000_000, company: "Tesla, SpaceX, X",        country: "🇺🇸", quip: "Wants to die on Mars. Just not on impact." },
  { rank: 2,  name: "Larry Page",                 emoji: "🔍", worth: 257_000_000_000, company: "Google / Alphabet",        country: "🇺🇸", quip: "You Googled him. He profited." },
  { rank: 3,  name: "Sergey Brin",                emoji: "🕶️", worth: 237_000_000_000, company: "Google / Alphabet",        country: "🇺🇸", quip: "The other Google guy. Equally loaded." },
  { rank: 4,  name: "Jeff Bezos",                 emoji: "📦", worth: 224_000_000_000, company: "Amazon, Blue Origin",      country: "🇺🇸", quip: "Your packages funded a rocket. You're welcome." },
  { rank: 5,  name: "Mark Zuckerberg",            emoji: "🤖", worth: 222_000_000_000, company: "Meta",                     country: "🇺🇸", quip: "Definitely, totally, 100% human." },
  { rank: 6,  name: "Larry Ellison",              emoji: "🛥️", worth: 190_000_000_000, company: "Oracle",                   country: "🇺🇸", quip: "Bought an entire Hawaiian island. Casually." },
  { rank: 7,  name: "Bernard Arnault",            emoji: "👜", worth: 171_000_000_000, company: "LVMH (luxury everything)", country: "🇫🇷", quip: "Owns the bags you can't afford to look at." },
  { rank: 8,  name: "Jensen Huang",               emoji: "🎮", worth: 154_000_000_000, company: "NVIDIA",                   country: "🇺🇸", quip: "Sells the shovels in the AI gold rush." },
  { rank: 9,  name: "Warren Buffett",             emoji: "🍔", worth: 149_000_000_000, company: "Berkshire Hathaway",       country: "🇺🇸", quip: "Worth $149B, still loves a McDonald's coupon." },
  { rank: 10, name: "Amancio Ortega",             emoji: "🧥", worth: 148_000_000_000, company: "Zara / Inditex",           country: "🇪🇸", quip: "Made fast fashion, slowly became unstoppable." },
  // ── ranks 11-20: approximate, refine with the real-time figures you can see ──
  { rank: 11, name: "Michael Dell",               emoji: "🖥️", worth: 145_000_000_000, company: "Dell Technologies",        country: "🇺🇸", quip: "You probably typed an essay on his stuff." },
  { rank: 12, name: "Steve Ballmer",              emoji: "🏀", worth: 144_000_000_000, company: "Microsoft / Clippers",     country: "🇺🇸", quip: "Screams 'DEVELOPERS' into a pile of money." },
  { rank: 13, name: "Jim Walton",                 emoji: "🛒", worth: 135_000_000_000, company: "Walmart",                  country: "🇺🇸", quip: "The quiet Walton. Banks, Walmart, colossal allowance." },
  { rank: 14, name: "Rob Walton",                 emoji: "🛒", worth: 134_000_000_000, company: "Walmart",                  country: "🇺🇸", quip: "Rollback prices, roll-up fortune." },
  { rank: 15, name: "Alice Walton",               emoji: "🎨", worth: 132_000_000_000, company: "Walmart",                  country: "🇺🇸", quip: "World's richest woman. Collects art and zeros." },
  { rank: 16, name: "Françoise Bettencourt Meyers",emoji: "💄", worth: 112_000_000_000, company: "L'Oréal",                  country: "🇫🇷", quip: "Because she's worth it. Literally." },
  { rank: 17, name: "Bill Gates",                 emoji: "💻", worth: 108_000_000_000, company: "Microsoft",                country: "🇺🇸", quip: "Giving it away faster than he makes it. Allegedly." },
  { rank: 18, name: "Michael Bloomberg",          emoji: "📰", worth: 106_000_000_000, company: "Bloomberg LP",             country: "🇺🇸", quip: "Named a terminal after himself. It costs $24k/yr." },
  { rank: 19, name: "Carlos Slim",                emoji: "📞", worth: 103_000_000_000, company: "América Móvil",            country: "🇲🇽", quip: "Owns the phone call you're avoiding." },
  { rank: 20, name: "Mukesh Ambani",              emoji: "🏰", worth: 100_000_000_000, company: "Reliance Industries",      country: "🇮🇳", quip: "Lives in a 27-floor house. For 6 people." },
];

// 🧍 Reference points for the "ordinary human" comparisons.
const REFERENCES = {
  medianSalaryUSA: 59_000,        // median individual income, USD/yr
  minWageHourly: 7.25,            // US federal minimum wage
  workHoursPerYear: 2080,         // full-time
  avgLifespanYears: 73,           // global avg life expectancy
  coffeePrice: 5,                 // a fancy latte
  iphonePrice: 1199,              // a shiny new phone
  housePriceUSA: 420_000,         // median US home
  teslaPrice: 42_000,             // a Model 3-ish
  pizzaPrice: 15,                 // a large pizza
  privateJetPrice: 65_000_000,    // a Gulfstream-ish
  bill100Thickness_m: 0.000109,   // thickness of one $100 bill in meters
  bill100Length_m: 0.156,         // length of a $100 bill in meters
  secondsToCountOne: 1,           // 1 dollar per second
  lottoJackpot: 1_000_000,        // "set for life" lottery win
  everestHeight_m: 8849,          // Mt Everest
  issAltitude_m: 408_000,         // International Space Station altitude
  moonDistance_m: 384_400_000,    // Earth to Moon
};
