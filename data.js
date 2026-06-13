// 💰 Top 20 Richest Humans on Planet Earth 💰
// Net worth figures are approximate (early 2026 vibes) and meant for FUN, not financial advice.
// Numbers in USD. They wobble daily because rich-people money is made of vibes and stock tickers.

const RICH_LIST = [
  { rank: 1,  name: "Elon Musk",            emoji: "🚀", worth: 421_000_000_000, company: "Tesla, SpaceX, X",        country: "🇺🇸", quip: "Wants to die on Mars. Just not on impact." },
  { rank: 2,  name: "Bernard Arnault",      emoji: "👜", worth: 198_000_000_000, company: "LVMH (luxury everything)", country: "🇫🇷", quip: "Owns the bags you can't afford to look at." },
  { rank: 3,  name: "Jeff Bezos",           emoji: "📦", worth: 215_000_000_000, company: "Amazon, Blue Origin",      country: "🇺🇸", quip: "Your packages funded a rocket. You're welcome." },
  { rank: 4,  name: "Mark Zuckerberg",      emoji: "🤖", worth: 207_000_000_000, company: "Meta",                     country: "🇺🇸", quip: "Definitely, totally, 100% human." },
  { rank: 5,  name: "Larry Ellison",        emoji: "🛥️", worth: 192_000_000_000, company: "Oracle",                   country: "🇺🇸", quip: "Bought an entire Hawaiian island. Casually." },
  { rank: 6,  name: "Larry Page",           emoji: "🔍", worth: 161_000_000_000, company: "Google / Alphabet",        country: "🇺🇸", quip: "You Googled him. He profited." },
  { rank: 7,  name: "Warren Buffett",       emoji: "🍔", worth: 150_000_000_000, company: "Berkshire Hathaway",       country: "🇺🇸", quip: "Worth $150B, still loves a McDonald's coupon." },
  { rank: 8,  name: "Sergey Brin",          emoji: "🕶️", worth: 152_000_000_000, company: "Google / Alphabet",        country: "🇺🇸", quip: "The other Google guy. Equally loaded." },
  { rank: 9,  name: "Steve Ballmer",        emoji: "🏀", worth: 145_000_000_000, company: "Microsoft / Clippers",     country: "🇺🇸", quip: "Screams 'DEVELOPERS' into a pile of money." },
  { rank: 10, name: "Bill Gates",           emoji: "💻", worth: 138_000_000_000, company: "Microsoft",                country: "🇺🇸", quip: "Giving it away faster than he makes it. Allegedly." },
  { rank: 11, name: "Mukesh Ambani",        emoji: "🏰", worth: 116_000_000_000, company: "Reliance Industries",      country: "🇮🇳", quip: "Lives in a 27-floor house. For 6 people." },
  { rank: 12, name: "Michael Bloomberg",    emoji: "📰", worth: 105_000_000_000, company: "Bloomberg LP",             country: "🇺🇸", quip: "Named a terminal after himself. It costs $24k/yr." },
  { rank: 13, name: "Amancio Ortega",       emoji: "🧥", worth: 103_000_000_000, company: "Zara / Inditex",           country: "🇪🇸", quip: "Made fast fashion, slowly became unstoppable." },
  { rank: 14, name: "Gautam Adani",         emoji: "⚡", worth: 98_000_000_000,  company: "Adani Group",              country: "🇮🇳", quip: "Ports, power, and a rollercoaster net worth." },
  { rank: 15, name: "Jensen Huang",         emoji: "🎮", worth: 114_000_000_000, company: "NVIDIA",                   country: "🇺🇸", quip: "Sells the shovels in the AI gold rush." },
  { rank: 16, name: "Michael Dell",         emoji: "🖥️", worth: 96_000_000_000,  company: "Dell Technologies",        country: "🇺🇸", quip: "You probably typed an essay on his stuff." },
  { rank: 17, name: "Carlos Slim",          emoji: "📞", worth: 92_000_000_000,  company: "América Móvil",            country: "🇲🇽", quip: "Owns the phone call you're avoiding." },
  { rank: 18, name: "Françoise Bettencourt",emoji: "💄", worth: 88_000_000_000,  company: "L'Oréal",                  country: "🇫🇷", quip: "Because she's worth it. Literally." },
  { rank: 19, name: "Rob Walton",           emoji: "🛒", worth: 86_000_000_000,  company: "Walmart",                  country: "🇺🇸", quip: "Rollback prices, roll-up fortune." },
  { rank: 20, name: "Zhong Shanshan",       emoji: "💧", worth: 62_000_000_000,  company: "Nongfu Spring (water)",    country: "🇨🇳", quip: "Got insanely rich selling... bottled water." },
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
