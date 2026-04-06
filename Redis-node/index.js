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

const getRandomCard = () => {
  const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits = ["HH","DD","CC","SS"];
  return cards[Math.floor(Math.random()*cards.length)] + suits[Math.floor(Math.random()*suits.length)];
};

const saveHistory = async (game, result) => {
  const key = `${game}_history`;
  let history = await redis.get(key);
  history = history ? JSON.parse(history) : [];

  history.unshift(result);
  if (history.length > 10) history = history.slice(0, 10);

  await redis.set(key, JSON.stringify(history));
};

//////////////////////////////////////////////////////
// 🧠 CARD RANK SYSTEM (REAL)
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
  const values = cards.map(getCardValue).sort((a, b) => a - b);
  const suits = cards.map(c => c.slice(-2));

  const isSameSuit = suits.every(s => s === suits[0]);
  const isTrail = values[0] === values[1] && values[1] === values[2];

  const isSequence =
    values[0] + 1 === values[1] &&
    values[1] + 1 === values[2];

  if (isTrail) return { rank: 6, name: "Trail", high: values[0] };
  if (isSequence && isSameSuit) return { rank: 5, name: "Pure Sequence", high: values[2] };
  if (isSequence) return { rank: 4, name: "Sequence", high: values[2] };
  if (isSameSuit) return { rank: 3, name: "Color", high: values[2] };
  if (values[0] === values[1] || values[1] === values[2])
    return { rank: 2, name: "Pair", high: values[1] };

  return { rank: 1, name: "High Card", high: values[2] };
};

//////////////////////////////////////////////////////
// 🐉 DRAGON TIGER
//////////////////////////////////////////////////////

const getDragonTigerResultold = async (roundId) => {
  const bets = await Bet.find({ roundId, game: "dt20" });

  if (bets.length === 0) {
    return { C1: getRandomCard(), C2: getRandomCard(), winner: "random" };
  }

  let dragon = 0, tiger = 0;

  bets.forEach(b => {
    if (b.side === "dragon") dragon += b.amount;
    if (b.side === "tiger") tiger += b.amount;
  });

  let winner = dragon < tiger ? "dragon" : "tiger";

  const val = (c) => {
    let v = c.slice(0, -2);
    if (["J","Q","K"].includes(v)) return 10;
    if (v === "A") return 1;
    return parseInt(v);
  };

  let C1, C2;

  while (true) {
    C1 = getRandomCard();
    C2 = getRandomCard();

    if (winner === "dragon" && val(C1) > val(C2)) break;
    if (winner === "tiger" && val(C2) > val(C1)) break;
  }

  return { C1, C2, winner };
};

const getDragonTigerResult = async (roundId) => {
  const bets = await Bet.find({ roundId, game: "dt20" });

  const val = (c) => {
    let v = c.slice(0, -2);
    if (["J","Q","K"].includes(v)) return 10;
    if (v === "A") return 1;
    return parseInt(v);
  };

  let C1, C2;

  while (true) {
    C1 = getRandomCard();
    C2 = getRandomCard();

    if (val(C1) !== val(C2)) break; // tie avoid
  }

  let winner = val(C1) > val(C2) ? "dragon" : "tiger";

  return { C1, C2, winner };
};

//////////////////////////////////////////////////////
// 🃏 TEEN PATTI
//////////////////////////////////////////////////////

const getTeenPattiResult = async (roundId, game) => {
  const bets = await Bet.find({ roundId, game });

  // if (bets.length === 0) {
  //   const A = [getRandomCard(), getRandomCard(), getRandomCard()];
  //   const B = [getRandomCard(), getRandomCard(), getRandomCard()];

  //   return {
  //     C1: A[0], C3: A[1], C5: A[2],
  //     C2: B[0], C4: B[1], C6: B[2],
  //     winner: "random"
  //   };
  // }

  if (bets.length === 0) {
  const A = [getRandomCard(), getRandomCard(), getRandomCard()];
  const B = [getRandomCard(), getRandomCard(), getRandomCard()];

  const rA = getRank(A);
  const rB = getRank(B);

  let winner =
    rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)
      ? "Player A"
      : "Player B";

  return {
    C1: A[0], C3: A[1], C5: A[2],
    C2: B[0], C4: B[1], C6: B[2],
    winner
  };
}

  let A_amt = 0, B_amt = 0;

  bets.forEach(b => {
    if (b.side === "A") A_amt += b.amount;
    if (b.side === "B") B_amt += b.amount;
  });

  let winner = A_amt < B_amt ? "A" : "B";

  let A_cards, B_cards, rA, rB;

  while (true) {
    A_cards = [getRandomCard(), getRandomCard(), getRandomCard()];
    B_cards = [getRandomCard(), getRandomCard(), getRandomCard()];

    rA = getRank(A_cards);
    rB = getRank(B_cards);

    if (winner === "A") {
      if (rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)) break;
    } else {
      if (rB.rank > rA.rank || (rA.rank === rB.rank && rB.high > rA.high)) break;
    }
  }

  return {
    C1: A_cards[0],
    C3: A_cards[1],
    C5: A_cards[2],
    C2: B_cards[0],
    C4: B_cards[1],
    C6: B_cards[2],
    winner
  };
};

//////////////////////////////////////////////////////
// 🃏 JOKER TEEN PATTI
//////////////////////////////////////////////////////

const getJokerResultold = async (roundId) => {
  const bets = await Bet.find({ roundId, game: "joker120" });

  const jokerCard = getRandomCard();
  const jokerValue = jokerCard.slice(0, -2);

  if (bets.length === 0) {
    const A = [getRandomCard(), getRandomCard(), getRandomCard()];
    const B = [getRandomCard(), getRandomCard(), getRandomCard()];

    return {
      C1: jokerCard,
      C2: B[0], C3: A[0], C4: B[1], C5: A[1], C6: B[2], C7: A[2],
      winner: "random",
      joker: jokerValue
    };
  }

  let A_amt = 0, B_amt = 0;

  bets.forEach(b => {
    if (b.side === "A") A_amt += b.amount;
    if (b.side === "B") B_amt += b.amount;
  });

  let winner = A_amt < B_amt ? "A" : "B";

  let A_cards, B_cards;

  while (true) {
    A_cards = [getRandomCard(), getRandomCard(), getRandomCard()];
    B_cards = [getRandomCard(), getRandomCard(), getRandomCard()];

    const rA = getRank(A_cards);
    const rB = getRank(B_cards);

    if (winner === "A" && rA.rank >= rB.rank) break;
    if (winner === "B" && rB.rank >= rA.rank) break;
  }

  return {
    C1: jokerCard,
    C2: B_cards[0],
    C3: A_cards[0],
    C4: B_cards[1],
    C5: A_cards[1],
    C6: B_cards[2],
    C7: A_cards[2],
    winner,
    joker: jokerValue
  };
};

const getJokerResult = async (roundId) => {
  const bets = await Bet.find({ roundId, game: "joker120" });

  const jokerCard = getRandomCard();
  const jokerValue = jokerCard.slice(0, -2);

  let A_cards, B_cards, winner;

  // 🔥 SAME LOGIC for both cases (bets ho ya na ho)
  if (bets.length === 0) {
    A_cards = [getRandomCard(), getRandomCard(), getRandomCard()];
    B_cards = [getRandomCard(), getRandomCard(), getRandomCard()];

    const rA = getRank(A_cards);
    const rB = getRank(B_cards);

    winner =
      rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high)
        ? "Player A"
        : "Player B";

  } else {
    let A_amt = 0, B_amt = 0;

    bets.forEach(b => {
      if (b.side === "A") A_amt += b.amount;
      if (b.side === "B") B_amt += b.amount;
    });

    winner = A_amt < B_amt ? "Player A" : "Player B";

    while (true) {
      A_cards = [getRandomCard(), getRandomCard(), getRandomCard()];
      B_cards = [getRandomCard(), getRandomCard(), getRandomCard()];

      const rA = getRank(A_cards);
      const rB = getRank(B_cards);

      if (winner === "Player A" && (rA.rank > rB.rank || (rA.rank === rB.rank && rA.high > rB.high))) break;
      if (winner === "Player B" && (rB.rank > rA.rank || (rA.rank === rB.rank && rB.high > rA.high))) break;
    }
  }

  return {
    C1: jokerCard,
    C2: B_cards[0],
    C3: A_cards[0],
    C4: B_cards[1],
    C5: A_cards[1],
    C6: B_cards[2],
    C7: A_cards[2],
    winner,
    joker: jokerValue
  };
};

//////////////////////////////////////////////////////
// 🎮 GAME ENGINE
//////////////////////////////////////////////////////

const runGame = async (gameName, logicFn) => {
  while (true) {
    let time = 20;
    const roundId = getRoundId();

    while (time > 0) {
      await redis.set(gameName, JSON.stringify({
        roundId,
        autotime: time,
        status: "running"
      }));
      await delay(1000);
      time--;
    }

    await redis.set(gameName, JSON.stringify({
      roundId,
      autotime: 0,
      status: "suspend"
    }));

    const result = await logicFn(roundId);

    let data = {
      roundId,
      autotime: 0,
      status: "dealing"
    };

    for (let key of Object.keys(result)) {
      if (key === "winner") continue;
      await delay(1000);
      data[key] = result[key];
      await redis.set(gameName, JSON.stringify(data));
    }

    data.status = "result";
    data.winner = result.winner;

    await redis.set(gameName, JSON.stringify(data));

    await saveHistory(gameName, { roundId, ...result });

    await delay(3000);
  }
};

//////////////////////////////////////////////////////
// 📡 API
//////////////////////////////////////////////////////

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
// 🚀 START SERVER
//////////////////////////////////////////////////////

app.listen(3030, () => {
  console.log("Server running");

  runGame("dt20", getDragonTigerResult);
  runGame("teen20", (id) => getTeenPattiResult(id, "teen20"));
  runGame("joker120", getJokerResult);
});