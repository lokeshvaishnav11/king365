// const express = require("express");
// const Redis = require("ioredis");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// //////////////////////////////////////////////////////
// // 🔗 MONGODB
// //////////////////////////////////////////////////////

// const dsn = "mongodb+srv://365infayou:Jv9lwv6csl7J1Jp5@cluster365.sxln4q8.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster365";

// mongoose.connect(dsn)
//   .then(() => console.log("Mongo Connected"))
//   .catch(err => console.log(err));

// //////////////////////////////////////////////////////
// // 🔥 REDIS
// //////////////////////////////////////////////////////

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
// });

// //////////////////////////////////////////////////////
// // 🧠 MODEL
// //////////////////////////////////////////////////////

// const BetSchema = new mongoose.Schema({
//   roundId: Number,
//   game: String,
//   userId: String,
//   amount: Number,
//   side: String,
// });

// const Bet = mongoose.model("Bet", BetSchema);

// //////////////////////////////////////////////////////
// // 🧠 HELPERS
// //////////////////////////////////////////////////////

// const delay = (ms) => new Promise(res => setTimeout(res, ms));

// let counter = 0;
// const getRoundId = () => {
//   counter = (counter + 1) % 1000;
//   return Number(`${Date.now()}${counter}`);
// };

// const getRandomCard = () => {
//   const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
//   const suits = ["HH","DD","CC","SS"];
//   return cards[Math.floor(Math.random()*cards.length)] + suits[Math.floor(Math.random()*suits.length)];
// };

// const saveHistory = async (game, result) => {
//   const key = `${game}_history`;
//   let history = await redis.get(key);
//   history = history ? JSON.parse(history) : [];

//   history.unshift(result);
//   if (history.length > 10) history = history.slice(0, 10);

//   await redis.set(key, JSON.stringify(history));
// };

// //////////////////////////////////////////////////////
// // 🎴 DECK SYSTEM (HH/DD/CC/SS)
// //////////////////////////////////////////////////////

// const createDeck = () => {
//   const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
//   const suits = ["HH","DD","CC","SS"];

//   let deck = [];
//   for (let c of cards) {
//     for (let s of suits) {
//       deck.push(c + s);
//     }
//   }
//   return deck;
// };

// const shuffleDeck = (deck) => {
//   for (let i = deck.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [deck[i], deck[j]] = [deck[j], deck[i]];
//   }
//   return deck;
// };

// const draw = (deck, n) => deck.splice(0, n);

// //////////////////////////////////////////////////////
// // 🧠 CARD RANK SYSTEM (REAL)
// //////////////////////////////////////////////////////

// const getCardValue = (card) => {
//   let v = card.slice(0, -2);
//   if (v === "A") return 14;
//   if (v === "K") return 13;
//   if (v === "Q") return 12;
//   if (v === "J") return 11;
//   return parseInt(v);
// };

// const getRank = (cards) => {
//   const values = cards.map(getCardValue).sort((a, b) => a - b);
//   const suits = cards.map(c => c.slice(-2));

//   const isSameSuit = suits.every(s => s === suits[0]);
//   const isTrail = values[0] === values[1] && values[1] === values[2];

//   const isSequence =
//     values[0] + 1 === values[1] &&
//     values[1] + 1 === values[2];

//   if (isTrail) return { rank: 6, name: "Trail", high: values[0] };
//   if (isSequence && isSameSuit) return { rank: 5, name: "Pure Sequence", high: values[2] };
//   if (isSequence) return { rank: 4, name: "Sequence", high: values[2] };
//   if (isSameSuit) return { rank: 3, name: "Color", high: values[2] };
//   if (values[0] === values[1] || values[1] === values[2])
//     return { rank: 2, name: "Pair", high: values[1] };

//   return { rank: 1, name: "High Card", high: values[2] };
// };

// //////////////////////////////////////////////////////
// // 🐉 DRAGON TIGER
// //////////////////////////////////////////////////////

// const getDragonTigerResultold = async (roundId) => {
//   const bets = await Bet.find({ roundId, game: "dt20" });

//   if (bets.length === 0) {
//     return { C1: getRandomCard(), C2: getRandomCard(), winner: "random" };
//   }

//   let dragon = 0, tiger = 0;

//   bets.forEach(b => {
//     if (b.side === "dragon") dragon += b.amount;
//     if (b.side === "tiger") tiger += b.amount;
//   });

//   let winner = dragon < tiger ? "dragon" : "tiger";

//   const val = (c) => {
//     let v = c.slice(0, -2);
//     if (["J","Q","K"].includes(v)) return 10;
//     if (v === "A") return 1;
//     return parseInt(v);
//   };

//   let C1, C2;

//   while (true) {
//     C1 = getRandomCard();
//     C2 = getRandomCard();

//     if (winner === "dragon" && val(C1) > val(C2)) break;
//     if (winner === "tiger" && val(C2) > val(C1)) break;
//   }

//   return { C1, C2, winner };
// };

// const getDragonTigerResult = async (roundId) => {
//   const bets = await Bet.find({ roundId, game: "dt20" });

//   const val = (c) => {
//     let v = c.slice(0, -2);
//     if (["J","Q","K"].includes(v)) return 10;
//     if (v === "A") return 1;
//     return parseInt(v);
//   };
//   const deck = shuffleDeck(createDeck());


//   let C1, C2;

//   while (true) {
//     C1 = draw(deck,1)[0];
//     C2 = draw(deck,1)[0];

//     if (val(C1) !== val(C2)) break; // tie avoid
//   }

//   let winner = val(C1) > val(C2) ? "dragon" : "tiger";

//   return { C1, C2, winner };
// };

// //////////////////////////////////////////////////////
// // 🃏 TEEN PATTI
// //////////////////////////////////////////////////////

// // const getTeenPattiResult = async (roundId, game) => {
// //   const bets = await Bet.find({ roundId, game });

// //   let A_amt = 0, B_amt = 0;

// //   bets.forEach(b => {
// //     if (b.side === "A") A_amt += b.amount;
// //     if (b.side === "B") B_amt += b.amount;
// //   });

// //   const forcedWinner = bets.length === 0
// //     ? null
// //     : (A_amt < B_amt ? "A" : "B");

// //   let A_cards, B_cards, rA, rB;

// //   while (true) {
// //     const deck = shuffleDeck(createDeck());

// //     A_cards = draw(deck, 3);
// //     B_cards = draw(deck, 3);

// //     rA = getRank(A_cards);
// //     rB = getRank(B_cards);

// //     if (!forcedWinner) break;

// //     if (forcedWinner === "A") {
// //       if (rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)) break;
// //     } else {
// //       if (rB.rank > rA.rank || (rA.rank === rB.rank && rB.high > rA.high)) break;
// //     }
// //   }

// //   const winner =
// //     rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)
// //       ? "A"
// //       : "B";

// //   return {
// //     C1: A_cards[0],
// //     C3: A_cards[1],
// //     C5: A_cards[2],
// //     C2: B_cards[0],
// //     C4: B_cards[1],
// //     C6: B_cards[2],
// //     winner
// //   };
// // };

// // 🔥 HAND COMPARE (ULTRA)


// //////////////////////////////////////////////////////
// // 🃏 JOKER TEEN PATTI
// //////////////////////////////////////////////////////

// const getJokerResultold = async (roundId) => {
//   const bets = await Bet.find({ roundId, game: "joker120" });

//   const jokerCard = getRandomCard();
//   const jokerValue = jokerCard.slice(0, -2);

//   if (bets.length === 0) {
//     const A = [getRandomCard(), getRandomCard(), getRandomCard()];
//     const B = [getRandomCard(), getRandomCard(), getRandomCard()];

//     return {
//       C1: jokerCard,
//       C2: B[0], C3: A[0], C4: B[1], C5: A[1], C6: B[2], C7: A[2],
//       winner: "random",
//       joker: jokerValue
//     };
//   }

//   let A_amt = 0, B_amt = 0;

//   bets.forEach(b => {
//     if (b.side === "A") A_amt += b.amount;
//     if (b.side === "B") B_amt += b.amount;
//   });

//   let winner = A_amt < B_amt ? "A" : "B";

//   let A_cards, B_cards;

//   while (true) {
//     A_cards = [getRandomCard(), getRandomCard(), getRandomCard()];
//     B_cards = [getRandomCard(), getRandomCard(), getRandomCard()];

//     const rA = getRank(A_cards);
//     const rB = getRank(B_cards);

//     if (winner === "A" && rA.rank >= rB.rank) break;
//     if (winner === "B" && rB.rank >= rA.rank) break;
//   }

//   return {
//     C1: jokerCard,
//     C2: B_cards[0],
//     C3: A_cards[0],
//     C4: B_cards[1],
//     C5: A_cards[1],
//     C6: B_cards[2],
//     C7: A_cards[2],
//     winner,
//     joker: jokerValue
//   };
// };

// const compareHands = (rA, rB, A_cards, B_cards) => {
//   // rank compare
//   if (rA.rank !== rB.rank) return rA.rank > rB.rank ? "A" : "B";

//   // high card compare
//   if (rA.high !== rB.high) return rA.high > rB.high ? "A" : "B";

//   // 🔥 full fallback compare (sorted cards)
//   const sortDesc = (cards) =>
//     cards.map(getCardValue).sort((a, b) => b - a);

//   const aVals = sortDesc(A_cards);
//   const bVals = sortDesc(B_cards);

//   for (let i = 0; i < 3; i++) {
//     if (aVals[i] !== bVals[i]) {
//       return aVals[i] > bVals[i] ? "A" : "B";
//     }
//   }

//   return "A"; // default (tie rare)
// };

// const getTeenPattiResult = async (roundId, game) => {
//   const bets = await Bet.find({ roundId, game });

//   let A_amt = 0, B_amt = 0;

//   bets.forEach(b => {
//     if (b.side === "A") A_amt += b.amount;
//     if (b.side === "B") B_amt += b.amount;
//   });

//   const forcedWinner =
//     bets.length === 0 ? null : (A_amt < B_amt ? "A" : "B");

//   let A_cards, B_cards, winner;

//   let attempts = 0;

//   while (true) {
//     attempts++;

//     const deck = shuffleDeck(createDeck());

//     A_cards = draw(deck, 3);
//     B_cards = draw(deck, 3);

//     const rA = getRank(A_cards);
//     const rB = getRank(B_cards);

//     const win = compareHands(rA, rB, A_cards, B_cards);

//     if (!forcedWinner) {
//       winner = win;
//       break;
//     }

//     if (win === forcedWinner) {
//       winner = forcedWinner;
//       break;
//     }

//     if (attempts > 50) {
//       winner = win; // fallback
//       break;
//     }
//   }

//   return {
//     C1: A_cards[0],
//     C2: B_cards[0],
//     C3: A_cards[1],
//     C4: B_cards[1],
//     C5: A_cards[2],
//     C6: B_cards[2],
//     winner
//   };
// };



// const getBestRankWithJoker = (cards, jokerValue) => {
//   let jokers = cards.filter(c => c.slice(0, -2) === jokerValue);
//   let normalCards = cards.filter(c => c.slice(0, -2) !== jokerValue);

//   // 🔥 No joker → normal rank
//   if (jokers.length === 0) {
//     return getRank(cards);
//   }

//   // 🔥 3 joker = highest (Trail A)
//   if (jokers.length === 3) {
//     return { rank: 6, name: "Trail", high: 14 };
//   }

//   // 🔥 2 joker → always Trail
//   if (jokers.length === 2) {
//     const val = getCardValue(normalCards[0]);
//     return { rank: 6, name: "Trail", high: val };
//   }

//   // 🔥 1 joker case (main logic)
//   const values = normalCards.map(getCardValue).sort((a,b)=>a-b);
//   const suits = normalCards.map(c => c.slice(-2));

//   // 👉 try Trail
//   if (values[0] === values[1]) {
//     return { rank: 6, name: "Trail", high: values[0] };
//   }

//   // 👉 try Pure Sequence
//   if (suits[0] === suits[1]) {
//     if (Math.abs(values[0] - values[1]) <= 2) {
//       return { rank: 5, name: "Pure Sequence", high: Math.max(...values) + 1 };
//     }
//   }

//   // 👉 try Sequence
//   if (Math.abs(values[0] - values[1]) <= 2) {
//     return { rank: 4, name: "Sequence", high: Math.max(...values) + 1 };
//   }

//   // 👉 try Color
//   if (suits[0] === suits[1]) {
//     return { rank: 3, name: "Color", high: Math.max(...values) };
//   }

//   // 👉 Pair bana do
//   return { rank: 2, name: "Pair", high: Math.max(...values) };
// };

// // const getJokerResult = async (roundId) => {
// //   const bets = await Bet.find({ roundId, game: "joker120" });

// //   const deck = shuffleDeck(createDeck());

// //   const jokerCard = draw(deck,1)[0];
// //   const jokerValue = jokerCard.slice(0, -2);

// //   let A_cards, B_cards, winner;

// //   let A_amt = 0, B_amt = 0;

// //   bets.forEach(b => {
// //     if (b.side === "A") A_amt += b.amount;
// //     if (b.side === "B") B_amt += b.amount;
// //   });

// //   const forcedWinner = bets.length === 0
// //     ? null
// //     : (A_amt < B_amt ? "A" : "B");

// //   while (true) {
// //     const newDeck = shuffleDeck(createDeck());

// //     // remove joker card from deck to avoid duplicate
// //     const index = newDeck.indexOf(jokerCard);
// //     if (index > -1) newDeck.splice(index, 1);

// //     A_cards = draw(newDeck,3);
// //     B_cards = draw(newDeck,3);

// //     const rA = getBestRankWithJoker(A_cards, jokerValue);
// //     const rB = getBestRankWithJoker(B_cards, jokerValue);

// //     if (!forcedWinner) {
// //       winner =
// //         rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)
// //           ? "A"
// //           : "B";
// //       break;
// //     }

// //     if (forcedWinner === "A") {
// //       if (rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)) {
// //         winner = "A";
// //         break;
// //       }
// //     } else {
// //       if (rB.rank > rA.rank || (rA.rank === rB.rank && rB.high > rA.high)) {
// //         winner = "B";
// //         break;
// //       }
// //     }
// //   }

// //   return {
// //     C1: jokerCard,
// //     C2: B_cards[0],
// //     C3: A_cards[0],
// //     C4: B_cards[1],
// //     C5: A_cards[1],
// //     C6: B_cards[2],
// //     C7: A_cards[2],
// //     winner,
// //     joker: jokerValue
// //   };
// // };

// const getJokerResult = async (roundId) => {
//   const bets = await Bet.find({ roundId, game: "joker120" });

//   let A_amt = 0, B_amt = 0;

//   bets.forEach(b => {
//     if (b.side === "A") A_amt += b.amount;
//     if (b.side === "B") B_amt += b.amount;
//   });

//   const forcedWinner =
//     bets.length === 0 ? null : (A_amt < B_amt ? "A" : "B");

//   const deck = shuffleDeck(createDeck());

//   const jokerCard = draw(deck, 1)[0];
//   const jokerValue = jokerCard.slice(0, -2);

//   let A_cards, B_cards, winner;
//   let attempts = 0;

//   while (true) {
//     attempts++;

//     const newDeck = shuffleDeck(createDeck());

//     // remove joker card
//     const index = newDeck.indexOf(jokerCard);
//     if (index > -1) newDeck.splice(index, 1);

//     A_cards = draw(newDeck, 3);
//     B_cards = draw(newDeck, 3);

//     const rA = getBestRankWithJoker(A_cards, jokerValue);
//     const rB = getBestRankWithJoker(B_cards, jokerValue);

//     const win = compareHands(rA, rB, A_cards, B_cards);

//     if (!forcedWinner) {
//       winner = win;
//       break;
//     }

//     if (win === forcedWinner) {
//       winner = forcedWinner;
//       break;
//     }

//     if (attempts > 50) {
//       winner = win;
//       break;
//     }
//   }

//   return {
//     C1: jokerCard,
//     C2: B_cards[0],
//     C3: A_cards[0],
//     C4: B_cards[1],
//     C5: A_cards[1],
//     C6: B_cards[2],
//     C7: A_cards[2],
//     winner,
//     joker: jokerValue
//   };
// };

// //////////////////////////////////////////////////////
// // 🎮 GAME ENGINE
// //////////////////////////////////////////////////////

// const runGame = async (gameName, logicFn) => {
//   while (true) {
//     let time = 20;
//     const roundId = getRoundId();

//     while (time > 0) {
//       await redis.set(gameName, JSON.stringify({
//         roundId,
//         autotime: time,
//         status: "running"
//       }));
//       await delay(1000);
//       time--;
//     }

//     await redis.set(gameName, JSON.stringify({
//       roundId,
//       autotime: 0,
//       status: "suspend"
//     }));

//     const result = await logicFn(roundId);

//     let data = {
//       roundId,
//       autotime: 0,
//       status: "dealing"
//     };

//     // for (let key of Object.keys(result)) {
//     //   if (key === "winner") continue;
//     //   await delay(1000);
//     //   data[key] = result[key];
//     //   await redis.set(gameName, JSON.stringify(data));
//     // }

//     const orderMap = {
//   teen20: ["C1","C2","C3","C4","C5","C6"],
//   joker120: ["C1","C2","C3","C4","C5","C6","C7"],
//   dt20: ["C1","C2"]
// };

// const order = orderMap[gameName] || Object.keys(result);

// for (let key of order) {
//   if (!result[key]) continue;
//   await delay(1000);
//   data[key] = result[key];
//   await redis.set(gameName, JSON.stringify(data));
// }

//     data.status = "result";
//     data.winner = result.winner;

//     await redis.set(gameName, JSON.stringify(data));

//     await saveHistory(gameName, { roundId, ...result });

//     await delay(3000);
//   }
// };

// //////////////////////////////////////////////////////
// // 📡 API
// //////////////////////////////////////////////////////

// app.get("/data/:name", async (req, res) => {
//   try {
//     const { name } = req.params;

//     const data = await redis.get(name);
//     const history = await redis.get(`${name}_history`);

//     res.json({
//       success: true,
//       data: data ? JSON.parse(data) : null,
//       history: history ? JSON.parse(history) : []
//     });
//   } catch (err) {
//     res.status(500).json({ success: false });
//   }
// });

// //////////////////////////////////////////////////////
// // 🚀 START SERVER
// //////////////////////////////////////////////////////

// app.listen(3030, () => {
//   console.log("Server running");

//   runGame("dt20", getDragonTigerResult);
//   runGame("teen20", (id) => getTeenPattiResult(id, "teen20"));
//   runGame("joker120", getJokerResult);
// });


const express = require("express");
const Redis = require("ioredis");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// 🔗 MONGODB
//////////////////////////////////////////////////////

const dsn = "mongodb+srv://365infayou:Jv9lwv6csl7J1Jp5@cluster365.sxln4q8.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster365";

mongoose.connect(dsn)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

//////////////////////////////////////////////////////
// 🔥 REDIS
//////////////////////////////////////////////////////

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

//////////////////////////////////////////////////////
// 🧠 MODEL
//////////////////////////////////////////////////////

const BetSchema = new mongoose.Schema({
  roundId: Number,
  game: String,
  userId: String,
  amount: Number,
  side: String,
});

const Bet = mongoose.model("Bet", BetSchema);

//////////////////////////////////////////////////////
// 🧠 HELPERS
//////////////////////////////////////////////////////

const delay = (ms) => new Promise(res => setTimeout(res, ms));

let counter = 0;
const getRoundId = () => {
  counter = (counter + 1) % 1000;
  return Number(`${Date.now()}${counter}`);
};

//////////////////////////////////////////////////////
// 🎴 DECK
//////////////////////////////////////////////////////

const createDeck = () => {
  const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits = ["HH","DD","CC","SS"];
  let deck = [];
  for (let c of cards) {
    for (let s of suits) {
      deck.push(c + s);
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const draw = (deck, n) => deck.splice(0, n);

//////////////////////////////////////////////////////
// 🧠 CARD LOGIC
//////////////////////////////////////////////////////

const getCardValue = (card) => {
  let v = card.slice(0, -2);
  if (v === "A") return 14;
  if (v === "K") return 13;
  if (v === "Q") return 12;
  if (v === "J") return 11;
  return parseInt(v);
};

const getRank = (cards) => {
  let values = cards.map(getCardValue).sort((a, b) => a - b);
  let suits = cards.map(c => c.slice(-2));

  const isSameSuit = suits.every(s => s === suits[0]);
  const isTrail = values[0] === values[1] && values[1] === values[2];

  const isLowSequence = (values[0] === 2 && values[1] === 3 && values[2] === 14);

  const isSequence =
    isLowSequence ||
    (values[0] + 1 === values[1] && values[1] + 1 === values[2]);

  if (isTrail) return { rank: 6, values: [values[0]] };
  if (isSequence && isSameSuit) return { rank: 5, values: [isLowSequence ? 3 : values[2]] };
  if (isSequence) return { rank: 4, values: [isLowSequence ? 3 : values[2]] };
  if (isSameSuit) return { rank: 3, values: [...values].sort((a,b)=>b-a) };

  if (values[0] === values[1] || values[1] === values[2]) {
    let pair = values[1];
    let kicker = values[0] === values[1] ? values[2] : values[0];
    return { rank: 2, values: [pair, kicker] };
  }

  return { rank: 1, values: [...values].sort((a,b)=>b-a) };
};

const compareHands = (rA, rB) => {
  if (rA.rank !== rB.rank) return rA.rank > rB.rank ? "A" : "B";

  const len = Math.max(rA.values.length, rB.values.length);

  for (let i = 0; i < len; i++) {
    const a = rA.values[i] || 0;
    const b = rB.values[i] || 0;
    if (a !== b) return a > b ? "A" : "B";
  }

  return "TIE";
};

//////////////////////////////////////////////////////
// 🃏 JOKER HELPERS
//////////////////////////////////////////////////////

const hasJoker = (cards, jokerValue) =>
  cards.some(c => c.slice(0, -2) === jokerValue);

// const getBestRankWithJoker = (cards, jokerValue) => {
//   const jokers = cards.filter(c => c.slice(0, -2) === jokerValue);
//   const normal = cards.filter(c => c.slice(0, -2) !== jokerValue);

//   if (jokers.length === 0) return getRank(cards);

//   if (jokers.length === 3) return { rank: 6, values: [14] };

//   if (jokers.length === 2) {
//     const val = getCardValue(normal[0]);
//     return { rank: 6, values: [val] };
//   }

//   const values = normal.map(getCardValue).sort((a,b)=>a-b);
//   const suits = normal.map(c => c.slice(-2));
//   const isSameSuit = suits[0] === suits[1];

//   if (values[0] === values[1]) return { rank: 6, values: [values[0]] };

//   // if (isSameSuit && Math.abs(values[0]-values[1]) <= 2)
//   //   return { rank: 5, values: [14] };

//   // if (Math.abs(values[0]-values[1]) <= 2)
//   //   return { rank: 4, values: [14] };

//   // Sequence check (with joker)
// for (let i = 2; i <= 14; i++) {
//   const test = [...values, i].sort((a,b)=>a-b);

//   const isSeq =
//     (test[0]+1 === test[1] && test[1]+1 === test[2]) ||
//     (test.toString() === "2,3,14");

//   if (isSeq) {
//     const isColor = cards.every(c => c.slice(-2) === cards[0].slice(-2));
//     return {
//       rank: isColor ? 5 : 4,
//       values: [test[2]]
//     };
//   }
// }

//   if (isSameSuit)
//     return { rank: 3, values: [14, ...values.sort((a,b)=>b-a)] };

//   return { rank: 2, values: [Math.max(...values), 14] };
// };

//////////////////////////////////////////////////////
// 🐉 DRAGON TIGER
//////////////////////////////////////////////////////


const getBestRankWithJoker = (cards, jokerValue) => {
  const jokers = cards.filter(c => c.slice(0, -2) === jokerValue);
  const normal = cards.filter(c => c.slice(0, -2) !== jokerValue);

  if (jokers.length === 0) return getRank(cards);

  // 🔥 3 Joker = Trail
  if (jokers.length === 3) return { rank: 6, values: [14] };

  // 🔥 2 Joker = Trail
  if (jokers.length === 2) {
    const val = getCardValue(normal[0]);
    return { rank: 6, values: [val] };
  }

  // 🔥 1 Joker case
  const values = normal.map(getCardValue).sort((a,b)=>a-b);
  const suits = normal.map(c => c.slice(-2));
  const isSameSuit = suits[0] === suits[1];

  // 👉 Pair → Trail
  if (values[0] === values[1]) {
    return { rank: 6, values: [values[0]] };
  }

  // 🔥 Sequence check with Joker
  for (let i = 2; i <= 14; i++) {
    const test = [...values, i].sort((a,b)=>a-b);

    const isSeq =
      (test[0]+1 === test[1] && test[1]+1 === test[2]) ||
      (test.toString() === "2,3,14");

    if (isSeq) {
      return {
        rank: isSameSuit ? 5 : 4, // ✅ FIX: normal cards se decide
        values: [test[2]]
      };
    }
  }

  // 🔥 Color (Flush)
  if (isSameSuit) {
    return {
      rank: 3,
      values: [14, ...values.sort((a,b)=>b-a)]
    };
  }

  // 🔥 Pair banega joker se
  return {
    rank: 2,
    values: [Math.max(...values), 14]
  };
};

const getDragonTigerResult = async () => {
  const deck = shuffleDeck(createDeck());

  let C1, C2;
  const val = (c) => {
    let v = c.slice(0, -2);
    if (["J","Q","K"].includes(v)) return 10;
    if (v === "A") return 1;
    return parseInt(v);
  };

  while (true) {
    C1 = draw(deck,1)[0];
    C2 = draw(deck,1)[0];
    if (val(C1) !== val(C2)) break;
  }

  return {
    C1,
    C2,
    winner: val(C1) > val(C2) ? "dragon" : "tiger"
  };
};

//////////////////////////////////////////////////////
// 🃏 TEEN PATTI (NORMAL)
//////////////////////////////////////////////////////

const getTeenPattiResult = async (roundId) => {
  const bets = await Bet.find({ roundId, game: "teen20" });

  let A_amt = 0, B_amt = 0;
  bets.forEach(b => {
    if (b.side === "A") A_amt += b.amount;
    if (b.side === "B") B_amt += b.amount;
  });

  const forcedWinner = bets.length ? (A_amt < B_amt ? "A" : "B") : null;

  let A_cards, B_cards, winner, attempts = 0;

  while (true) {
    attempts++;

    const deck = shuffleDeck(createDeck());
    A_cards = draw(deck,3);
    B_cards = draw(deck,3);

    const rA = getRank(A_cards);
    const rB = getRank(B_cards);

    let win = compareHands(rA, rB);
    if (win === "TIE") win = Math.random() < 0.5 ? "A" : "B";

    if (!forcedWinner || win === forcedWinner || attempts > 30) {
      winner = win;
      break;
    }
  }

  return {
    C1: A_cards[0], C2: B_cards[0],
    C3: A_cards[1], C4: B_cards[1],
    C5: A_cards[2], C6: B_cards[2],
    winner
  };
};

//////////////////////////////////////////////////////
// 🃏 JOKER TEEN PATTI
//////////////////////////////////////////////////////

const getJokerResult = async (roundId) => {
  const bets = await Bet.find({ roundId, game: "joker120" });

  let A_amt = 0, B_amt = 0;
  bets.forEach(b => {
    if (b.side === "A") A_amt += b.amount;
    if (b.side === "B") B_amt += b.amount;
  });

  const forcedWinner = bets.length ? (A_amt < B_amt ? "A" : "B") : null;

  const deck = shuffleDeck(createDeck());
  const jokerCard = draw(deck,1)[0];
  const jokerValue = jokerCard.slice(0,-2);

  let A_cards, B_cards, winner, attempts = 0;

  while (true) {
    attempts++;

    const newDeck = shuffleDeck(createDeck());
    const index = newDeck.indexOf(jokerCard);
    if (index > -1) newDeck.splice(index,1);

    A_cards = draw(newDeck,3);
    B_cards = draw(newDeck,3);

  // 👉 Player A Joker Check
let rA;
if (hasJoker(A_cards, jokerValue)) {
  rA = getBestRankWithJoker(A_cards, jokerValue);
} else {
  rA = getRank(A_cards);
}

// 👉 Player B Joker Check
let rB;
if (hasJoker(B_cards, jokerValue)) {
  rB = getBestRankWithJoker(B_cards, jokerValue);
} else {
  rB = getRank(B_cards);
}

    let win = compareHands(rA,rB);
    if (win === "TIE") win = Math.random() < 0.5 ? "A":"B";

    if (!forcedWinner || win === forcedWinner || attempts > 30) {
      winner = win;
      break;
    }
  }

  return {
    C1: jokerCard,
    C2: B_cards[0], C3: A_cards[0],
    C4: B_cards[1], C5: A_cards[1],
    C6: B_cards[2], C7: A_cards[2],
    winner,
    joker: jokerValue
  };
};

//////////////////////////////////////////////////////
// 🎮 GAME LOOP
//////////////////////////////////////////////////////

const runGame = async (gameName, logicFn) => {
  while (true) {
    let time = 20;
    const roundId = getRoundId();

    while (time--) {
      await redis.set(gameName, JSON.stringify({ roundId, autotime: time, status:"running" }));
      await delay(1000);
    }

    await redis.set(gameName, JSON.stringify({ roundId, autotime:0, status:"suspend" }));

    const result = await logicFn(roundId);

    let data = { roundId, autotime:0, status:"dealing" };

    const orderMap = {
      teen20:["C1","C2","C3","C4","C5","C6"],
      joker120:["C1","C2","C3","C4","C5","C6","C7"],
      dt20:["C1","C2"]
    };

    for (let key of orderMap[gameName]) {
      await delay(1000);
      data[key] = result[key];
      await redis.set(gameName, JSON.stringify(data));
    }

    data.status = "result";
    data.winner = result.winner;

    await redis.set(gameName, JSON.stringify(data));
    await delay(3000);
  }
};


app.get("/data/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const data = await redis.get(name);
    const history = await redis.get(`${name}_history`);

    res.json({
      success: true,
      data: data ? JSON.parse(data) : null,
      history: history ? JSON.parse(history) : []
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
//////////////////////////////////////////////////////
// 🚀 START
//////////////////////////////////////////////////////

app.listen(3030, () => {
  console.log("Server running");

  runGame("dt20", getDragonTigerResult);
  runGame("teen20", getTeenPattiResult);
  runGame("joker120", getJokerResult);
});