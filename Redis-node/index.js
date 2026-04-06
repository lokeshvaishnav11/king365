// const express = require("express")
// const Redis = require("ioredis");
// const mongoose = require("mongoose");
// const Match = require('./models/Match.model');
// const Market = require("./models/Market.model")
// const { default: axios } = require("axios");
// const app = express()
// // const dsn ="mongodb+srv://365infayou:Jv9lwv6csl7J1Jp5@cluster365.sxln4q8.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster365&tlsAllowInvalidCertificates=true";
// const dsn = "mongodb+srv://365infayou:Jv9lwv6csl7J1Jp5@cluster365.sxln4q8.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster365&tlsAllowInvalidCertificates=true"
// //  const dsn = "mongodb+srv://infayou:HkrflNhX6UxHLSqC@cluster0.zbf0n.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true";
// const setConnection = async()=>{
//     await mongoose.connect(dsn).then(()=>{
//         console.log("DataBase Connected Succesfully")
//     }).catch((err)=>{
//         console.log("error in connecting DataBase",err)
//     })
// }

//  setConnection()
// app.use(express.json());









// const PORT = 3030;

// app.listen(PORT , ()=>{
//     console.log(`server is Listeing on ${PORT}`)
// })


// const express = require("express");
// const Redis = require("ioredis");
// const mongoose = require("mongoose");

// const app = express();
// app.use(express.json());

// // 🔗 Mongo (optional, tu use kar raha hai to rakha hai)
// const dsn = "mongodb+srv://365infayou:Jv9lwv6csl7J1Jp5@cluster365.sxln4q8.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster365";

// mongoose.connect(dsn)
//   .then(() => console.log("Mongo Connected"))
//   .catch(err => console.log(err));

// // 🔥 Redis
// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
// });

// // ⏳ Delay helper
// const delay = (ms) => new Promise(res => setTimeout(res, ms));

// // 🎴 Random Card
// const getRandomCard = () => {
//   const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
//   const suits = ["H","D","C","S"];
//   return cards[Math.floor(Math.random()*cards.length)] + suits[Math.floor(Math.random()*suits.length)];
// };

// //////////////////////////////////////////////////////
// // 🐉 DRAGON TIGER
// //////////////////////////////////////////////////////

// const startDragonTiger = async () => {
//   while (true) {
//     let time = 20;

//     // ⏱ Timer
//     while (time > 0) {
//       await redis.set("dt20", JSON.stringify({
//         autotime: time,
//         status: "running"
//       }));
//       await delay(1000);
//       time--;
//     }

//     // 🛑 Bet Close
//     await redis.set("dt20", JSON.stringify({
//       autotime: 0,
//       status: "suspend"
//     }));

//     const C1 = getRandomCard(); // Dragon
//     const C2 = getRandomCard(); // Tiger

//     let data = {
//       autotime: 0,
//       status: "dealing"
//     };

//     // 🎴 Card 1
//     await delay(1000);
//     data.C1 = C1;
//     await redis.set("dt20", JSON.stringify(data));

//     // 🎴 Card 2
//     await delay(1000);
//     data.C2 = C2;
//     data.status = "result";
//     await redis.set("dt20", JSON.stringify(data));

//     // ⏳ Wait 3 sec
//     await delay(3000);
//   }
// };

// //////////////////////////////////////////////////////
// // 🃏 20-20 TEEN PATTI
// //////////////////////////////////////////////////////

// const start2020 = async () => {
//   while (true) {
//     let time = 20;

//     while (time > 0) {
//       await redis.set("2020", JSON.stringify({
//         autotime: time,
//         status: "running"
//       }));
//       await delay(1000);
//       time--;
//     }

//     await redis.set("2020", JSON.stringify({
//       autotime: 0,
//       status: "suspend"
//     }));

//     const cards = {
//       C1: getRandomCard(),
//       C2: getRandomCard(),
//       C3: getRandomCard(),
//       C4: getRandomCard(),
//       C5: getRandomCard(),
//       C6: getRandomCard(),
//     };

//     let data = {
//       autotime: 0,
//       status: "dealing"
//     };

//     // 🎴 1-1 card open
//     for (let key of Object.keys(cards)) {
//       await delay(1000);
//       data[key] = cards[key];
//       await redis.set("2020", JSON.stringify(data));
//     }

//     data.status = "result";
//     await redis.set("2020", JSON.stringify(data));

//     await delay(3000);
//   }
// };

// //////////////////////////////////////////////////////
// // 🃏 JOKER TEEN PATTI
// //////////////////////////////////////////////////////

// const startJoker = async () => {
//   while (true) {
//     let time = 20;

//     while (time > 0) {
//       await redis.set("joker", JSON.stringify({
//         autotime: time,
//         status: "running"
//       }));
//       await delay(1000);
//       time--;
//     }

//     await redis.set("joker", JSON.stringify({
//       autotime: 0,
//       status: "suspend"
//     }));

//     const cards = {
//       C1: getRandomCard(), // Joker
//       C2: getRandomCard(),
//       C3: getRandomCard(),
//       C4: getRandomCard(),
//       C5: getRandomCard(),
//       C6: getRandomCard(),
//       C7: getRandomCard(),
//     };

//     let data = {
//       autotime: 0,
//       status: "dealing"
//     };

//     for (let key of Object.keys(cards)) {
//       await delay(1000);
//       data[key] = cards[key];
//       await redis.set("joker", JSON.stringify(data));
//     }

//     data.status = "result";
//     await redis.set("joker", JSON.stringify(data));

//     await delay(3000);
//   }
// };


// app.get("/data/:name", async (req, res) => {
//   try {
//     const { name } = req.params;

//     // allowed games
//     const validGames = ["dt20", "2020", "joker"];

//     if (!validGames.includes(name)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid game name",
//       });
//     }

//     const data = await redis.get(name);

//     if (!data) {
//       return res.json({
//         success: true,
//         message: "No data yet",
//         data: null,
//       });
//     }

//     return res.json({
//       success: true,
//       data: JSON.parse(data),
//     });
//   } catch (err) {
//     console.error("Fetch Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// //////////////////////////////////////////////////////
// // 🚀 START SERVER
// //////////////////////////////////////////////////////

// const PORT = 3030;

// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);

//   // 🔥 Start all games
//   startDragonTiger();
//   start2020();
//   startJoker();
// });


const express = require("express");
const Redis = require("ioredis");
const mongoose = require("mongoose");

const app = express();
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
// 🧠 HELPERS
//////////////////////////////////////////////////////

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ✅ PURE NUMBER ROUND ID
let counter = 0;
const getRoundId = () => {
  counter = (counter + 1) % 1000;
  return Number(`${Date.now()}${counter}`);
};

// 🎴 Random Card
const getRandomCard = () => {
  const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits = ["H","D","C","S"];
  return cards[Math.floor(Math.random()*cards.length)] + suits[Math.floor(Math.random()*suits.length)];
};

//////////////////////////////////////////////////////
// 🐉 DRAGON TIGER
//////////////////////////////////////////////////////

const startDragonTiger = async () => {
  while (true) {
    let time = 20;
    const roundId = getRoundId();

    while (time > 0) {
      await redis.set("dt20", JSON.stringify({
        roundId,
        autotime: time,
        status: "running"
      }));
      await delay(1000);
      time--;
    }

    await redis.set("dt20", JSON.stringify({
      roundId,
      autotime: 0,
      status: "suspend"
    }));

    const C1 = getRandomCard();
    const C2 = getRandomCard();

    let data = {
      roundId,
      autotime: 0,
      status: "dealing"
    };

    await delay(1000);
    data.C1 = C1;
    await redis.set("dt20", JSON.stringify(data));

    await delay(1000);
    data.C2 = C2;
    data.status = "result";
    await redis.set("dt20", JSON.stringify(data));

    await delay(3000);
  }
};

//////////////////////////////////////////////////////
// 🃏 20-20 TEEN PATTI
//////////////////////////////////////////////////////

const start2020 = async () => {
  while (true) {
    let time = 20;
    const roundId = getRoundId();

    while (time > 0) {
      await redis.set("2020", JSON.stringify({
        roundId,
        autotime: time,
        status: "running"
      }));
      await delay(1000);
      time--;
    }

    await redis.set("2020", JSON.stringify({
      roundId,
      autotime: 0,
      status: "suspend"
    }));

    const cards = {
      C1: getRandomCard(),
      C2: getRandomCard(),
      C3: getRandomCard(),
      C4: getRandomCard(),
      C5: getRandomCard(),
      C6: getRandomCard(),
    };

    let data = {
      roundId,
      autotime: 0,
      status: "dealing"
    };

    for (let key of Object.keys(cards)) {
      await delay(1000);
      data[key] = cards[key];
      await redis.set("2020", JSON.stringify(data));
    }

    data.status = "result";
    await redis.set("2020", JSON.stringify(data));

    await delay(3000);
  }
};

//////////////////////////////////////////////////////
// 🃏 JOKER TEEN PATTI
//////////////////////////////////////////////////////

const startJoker = async () => {
  while (true) {
    let time = 20;
    const roundId = getRoundId();

    while (time > 0) {
      await redis.set("joker", JSON.stringify({
        roundId,
        autotime: time,
        status: "running"
      }));
      await delay(1000);
      time--;
    }

    await redis.set("joker", JSON.stringify({
      roundId,
      autotime: 0,
      status: "suspend"
    }));

    const cards = {
      C1: getRandomCard(),
      C2: getRandomCard(),
      C3: getRandomCard(),
      C4: getRandomCard(),
      C5: getRandomCard(),
      C6: getRandomCard(),
      C7: getRandomCard(),
    };

    let data = {
      roundId,
      autotime: 0,
      status: "dealing"
    };

    for (let key of Object.keys(cards)) {
      await delay(1000);
      data[key] = cards[key];
      await redis.set("joker", JSON.stringify(data));
    }

    data.status = "result";
    await redis.set("joker", JSON.stringify(data));

    await delay(3000);
  }
};

//////////////////////////////////////////////////////
// 📡 API: GET LIVE DATA
//////////////////////////////////////////////////////

app.get("/data/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const validGames = ["dt20", "2020", "joker"];

    if (!validGames.includes(name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid game name",
      });
    }

    const data = await redis.get(name);

    return res.json({
      success: true,
      data: data ? JSON.parse(data) : null,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

//////////////////////////////////////////////////////
// 🚀 START SERVER
//////////////////////////////////////////////////////

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);

  startDragonTiger();
  start2020();
  startJoker();
});