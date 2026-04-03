import { Request, Response } from "express";
import { ApiController } from "./ApiController";
import { redisReplica } from "../../database/redis";
import crypto from "crypto";

interface ICard {
  suit: string;
  value: string;
  numericValue: number;
  color: "red" | "black";
  isEven: boolean;
}

interface IGameRound {
  roundId: string;
  dragonCard: ICard;
  tigerCard: ICard;
  result: string;
  timestamp: Date;
}

export default class CustomDt20Controller extends ApiController {
  private static instance: CustomDt20Controller;
  private timerInterval: NodeJS.Timeout | null = null;
  private countdownInterval: NodeJS.Timeout | null = null;
  private currentRound: IGameRound | null = null;
  private roundHistory: IGameRound[] = [];
  private isGameActive: boolean = false;
  private currentLT: number = 20; // Countdown timer from 20 to 0
  private currentFT: number = 20; // First timer

  private constructor() {
    super();
  }

  public static getInstance(): CustomDt20Controller {
    if (!CustomDt20Controller.instance) {
      CustomDt20Controller.instance = new CustomDt20Controller();
    }
    return CustomDt20Controller.instance;
  }

  // Initialize the game system
  public initGame = async () => {
    console.log("🎮 Initializing Custom DT20 Game System...");
    
    // Load last round from Redis if exists
    await this.loadLastRound();
    
    // Start the timer
    this.startTimer();
    
    console.log("✅ Custom DT20 Game System initialized successfully");
  };

  // Start the 20-second timer
  private startTimer = () => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.isGameActive = true;
    
    // Create first round immediately
    this.createNewRound();

    // Start countdown timer (LT decreases every second)
    this.startCountdownTimer();

    console.log("⏱️  Timer started: New round every 20 seconds with countdown");
  };

  // Start countdown timer for LT (decreases from 20 to 0)
  // private startCountdownTimer = () => {
  //   this.countdownInterval = setInterval(() => {
  //     if (!this.isGameActive) return;
      
  //     this.currentLT--;
      
  //     // Update Redis with current LT value
  //     this.updateCurrentLT();
      
  //     console.log(`⏳ LT: ${this.currentLT}s`);
      
  //     // When LT reaches 0, suspend and create new round
  //     if (this.currentLT <= 0) {
  //       this.suspendCurrentRound();
  //     }
  //   }, 1000); // Decrease every second
  // };

  private startCountdownTimer = () => {
  if (this.countdownInterval) {
    clearInterval(this.countdownInterval);
  }

  this.countdownInterval = setInterval(() => {
    if (!this.isGameActive) return;

    this.currentLT--;

    // ✅ UPDATE REDIS EVERY SECOND
    this.updateCurrentLT();

    console.log("⏳ LT:", this.currentLT);

    if (this.currentLT <= 0) {
      clearInterval(this.countdownInterval!);
      this.suspendCurrentRound();
    }
  }, 1000);
};

  // Stop the game timer
  public stopTimer = () => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.isGameActive = false;
    console.log("⏹️  Timer stopped");
  };

  // Create a new game round
  // private createNewRound = async () => {
  //   try {
  //     console.log("\n🎲 Creating new round...");
      
  //     // Reset LT to 20 for new round
  //     this.currentLT = this.currentFT;
      
  //     // Generate cards
  //     const dragonCard = this.generateRandomCard();
  //     const tigerCard = this.generateRandomCard();

  //     // Calculate result based on lowest payout (lowest odds winner)
  //     const result = this.calculateResult(dragonCard, tigerCard);

  //     // Generate round ID
  //     const roundId = this.generateRoundId();

  //     // Create round object
  //     this.currentRound = {
  //       roundId,
  //       dragonCard,
  //       tigerCard,
  //       result,
  //       timestamp: new Date(),
  //     };

  //     // Add to history
  //     this.roundHistory.push(this.currentRound);
  //     if (this.roundHistory.length > 100) {
  //       this.roundHistory.shift(); // Keep last 100 rounds
  //     }

  //     // Save to Redis
  //     await this.saveRoundToRedis(this.currentRound);

  //     console.log(`✅ Round ${roundId} created:`);
  //     console.log(`   Dragon: ${dragonCard.value}${dragonCard.suit} (${dragonCard.color}, ${dragonCard.isEven ? 'even' : 'odd'})`);
  //     console.log(`   Tiger: ${tigerCard.value}${tigerCard.suit} (${tigerCard.color}, ${tigerCard.isEven ? 'even' : 'odd'})`);
  //     console.log(`   Result: ${result}`);

  //   } catch (error) {
  //     console.error("❌ Error creating new round:", error);
  //   }
  // };

  private createNewRound = async () => {
  this.currentLT = this.currentFT;

  await this.saveRoundToRedis({
    roundId: Date.now().toString(),
    dragonCard: {} as any,
    tigerCard: {} as any,
    result: "",
    timestamp: new Date(),
  });

  // ✅ RESTART COUNTDOWN
  this.startCountdownTimer();
};

  // Generate a random card
  private generateRandomCard = (): ICard => {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    
    // Calculate numeric value (A=1, J=11, Q=12, K=13)
    let numericValue: number;
    if (randomValue === "1") numericValue = 1;
    else if (randomValue === "J") numericValue = 11;
    else if (randomValue === "Q") numericValue = 12;
    else if (randomValue === "K") numericValue = 13;
    else numericValue = parseInt(randomValue);

    // Determine color
    const color: "red" | "black" = (randomSuit === "♥" || randomSuit === "♦") ? "red" : "black";

    // Determine if even
    const isEven = numericValue % 2 === 0;

    return {
      suit: randomSuit,
      value: randomValue,
      numericValue,
      color,
      isEven,
    };
  };

  // Calculate result based on lowest payout (house always wins strategy)
  private calculateResult = (dragon: ICard, tiger: ICard): string => {
    // Build all possible outcomes with their payouts
    const outcomes: { name: string; payout: number; condition: boolean }[] = [];

    // Main outcomes (higher payouts first)
    outcomes.push({ name: "Tie", payout: 50, condition: dragon.numericValue === tiger.numericValue });
    outcomes.push({ name: "Pair", payout: 12, condition: dragon.numericValue === tiger.numericValue });
    
    // Dragon wins
    if (dragon.numericValue > tiger.numericValue) {
      outcomes.push({ name: "Dragon", payout: 2, condition: true });
      
      // Dragon specific bets
      outcomes.push({ name: "Dragon Even", payout: 2.1, condition: dragon.isEven });
      outcomes.push({ name: "Dragon Odd", payout: 1.79, condition: !dragon.isEven });
      outcomes.push({ name: "Dragon Red", payout: 1.95, condition: dragon.color === "red" });
      outcomes.push({ name: "Dragon Black", payout: 1.95, condition: dragon.color === "black" });
      outcomes.push({ name: `Dragon Card ${dragon.value}`, payout: 12, condition: true });
    }

    // Tiger wins
    if (tiger.numericValue > dragon.numericValue) {
      outcomes.push({ name: "Tiger", payout: 2, condition: true });
      
      // Tiger specific bets
      outcomes.push({ name: "Tiger Even", payout: 2.1, condition: tiger.isEven });
      outcomes.push({ name: "Tiger Odd", payout: 1.79, condition: !tiger.isEven });
      outcomes.push({ name: "Tiger Red", payout: 1.95, condition: tiger.color === "red" });
      outcomes.push({ name: "Tiger Black", payout: 1.95, condition: tiger.color === "black" });
      outcomes.push({ name: `Tiger Card ${tiger.value}`, payout: 12, condition: true });
    }

    // Filter only winning outcomes
    const winningOutcomes = outcomes.filter(o => o.condition);

    // Find the outcome with LOWEST payout (house advantage)
    if (winningOutcomes.length > 0) {
      // Sort by payout (ascending) and pick the lowest
      winningOutcomes.sort((a, b) => a.payout - b.payout);
      return winningOutcomes[0].name;
    }

    // Default fallback
    return dragon.numericValue > tiger.numericValue ? "Dragon" : 
           tiger.numericValue > dragon.numericValue ? "Tiger" : "Tie";
  };

  // Generate unique round ID
  private generateRoundId = (): string => {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `DT20-${timestamp}-${random}`;
  };



  private saveRoundToRedis = async (round: IGameRound) => {
  try {
    const event_data = {
      match_id: round.roundId.toString(),
      title: "20-20 Dragon Tiger",
      autotime: "0",
      remark: " ",
      gtype: "dt20",

      min: 100,
      max: 500000,

      C1: "1",
      C2: "1",
      C3: "1",

      card: "1,1",

      ft: this.currentFT,
      lt: this.currentLT,
      grp: 5,

      mid: round.roundId,

      tv: "https://stream-s-43.xink.site/casino-stream?id=dt20",

      // ✅ ONLY 3 MARKETS
      market: [
        {
          MarketName: "Dragon",
          Runners: [
            {
              b1: 2,
              bs1: 600000,
              etype: "fancy",
              gstatus: "OPEN",
              max: 300000,
              min: 100,
              nat: "Dragon",
              sid: 1,
              sr: 1,
              subtype: "dt20",
              runnerName: "Dragon"
            }
          ],
          subtype: "",
          sid: 0
        },
        {
          MarketName: "Tiger",
          Runners: [
            {
              b1: 2,
              bs1: 600000,
              etype: "fancy",
              gstatus: "OPEN",
              max: 300000,
              min: 100,
              nat: "Tiger",
              sid: 2,
              sr: 2,
              subtype: "dt20",
              runnerName: "Tiger"
            }
          ],
          subtype: "",
          sid: 0
        },
        {
          MarketName: "Tie",
          Runners: [
            {
              b1: 50,
              bs1: 60000,
              etype: "fancy",
              gstatus: "OPEN",
              max: 30000,
              min: 100,
              nat: "Tie",
              sid: 3,
              sr: 3,
              subtype: "dt20",
              runnerName: "Tie"
            }
          ],
          subtype: "",
          sid: 0
        }
      ]
    };

    // ✅ FINAL REDIS STRUCTURE (100% MATCH)
    const redisData = {
      message: "",
      error: false,
      code: 200,

      data: {
        gameName: "dt20",

        event_data,

        // 👇 ye fields bhi upar duplicate honi chahiye (same API jaisa)
        card: event_data.card,
        ft: event_data.ft,
        grp: event_data.grp,
        gtype: event_data.gtype,
        lt: event_data.lt,
        mid: event_data.mid,
        remark: event_data.remark,
        tv: event_data.tv,
         "defaultMarkets": [
            {
                "MarketName": "Dragon",
                "Runners": [
                    {
                        "RunnerName": "Dragon",
                        "SelectionId": "1"
                    }
                ]
            },
            {
                "MarketName": "Tie",
                "Runners": [
                    {
                        "RunnerName": "Tie",
                        "SelectionId": "3"
                    }
                ]
            },
            {
                "MarketName": "Tiger",
                "Runners": [
                    {
                        "RunnerName": "Tiger",
                        "SelectionId": "2"
                    }
                ]
            },
         ]
      }
    };

    await redisReplica.set("dt20", JSON.stringify(redisData));
    await redisReplica.publish("saveCasinoData", JSON.stringify(redisData));

    console.log("🔥 PERFECT FORMAT SAVED (event_data MATCH)");
  } catch (error) {
    console.error("❌ Redis Error:", error);
  }
};

  // Update only LT value in Redis (called every second)
  // private updateCurrentLT = async () => {
  //   try {
  //     const existingData = await redisReplica.get(`dt20`);
  //     if (existingData) {
  //       const parsed = JSON.parse(existingData);
  //       if (parsed.data) {
  //         parsed.data.lt = this.currentLT;
  //         parsed.data.status = this.currentLT <= 0 ? "SUSPENDED" : "OPEN";
  //         // Update all sub items gstatus
  //         if (parsed.data.sub && Array.isArray(parsed.data.sub)) {
  //           parsed.data.sub.forEach((item: any) => {
  //             item.gstatus = this.currentLT <= 0 ? "SUSPENDED" : "OPEN";
  //           });
  //         }
  //         await redisReplica.set(`dt20`, JSON.stringify(parsed));
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating LT:", error);
  //   }
  // };
private updateCurrentLT = async () => {
  try {
    const existingData = await redisReplica.get("dt20");
    if (!existingData) return;

    const parsed = JSON.parse(existingData);
    if (!parsed.data || !parsed.data.event_data) return;

    // ✅ UPDATE LT
    parsed.data.lt = this.currentLT;
    parsed.data.event_data.lt = this.currentLT;

    // ✅ AUTOTIME SAME AS LT
    parsed.data.event_data.autotime = this.currentLT.toString();

    // ✅ STATUS
    const status = this.currentLT <= 0 ? "SUSPENDED" : "OPEN";

    parsed.data.status = status;
    parsed.data.event_data.gstatus = status;

    // ✅ MARKET STATUS
    parsed.data.event_data.market.forEach((m: any) => {
      m.Runners.forEach((r: any) => {
        r.gstatus = status;
      });
    });

    await redisReplica.set("dt20", JSON.stringify(parsed));

  } catch (error) {
    console.error("❌ LT update error:", error);
  }
};

  // Suspend current round when LT reaches 0
  // private suspendCurrentRound = async () => {
  //   try {
  //     console.log("⏰ LT reached 0 - Suspending round...");
      
  //     // Get existing round data
  //     const existingData = await redisReplica.get(`dt20`);
  //     if (existingData) {
  //       const parsed = JSON.parse(existingData);
  //       if (parsed.data) {
  //         // Mark as SUSPENDED
  //         parsed.data.gstatus = "SUSPENDED";
  //         parsed.data.status = "SUSPENDED";
          
  //         // Update all sub items gstatus to SUSPENDED
  //         if (parsed.data.sub && Array.isArray(parsed.data.sub)) {
  //           parsed.data.sub.forEach((item: any) => {
  //             item.gstatus = "SUSPENDED";
  //           });
  //         }
          
  //         // Calculate winner based on LOWEST PAYOUT from actual bets
  //         const winner = this.calculateWinnerFromBets(parsed.data.sub);
  //         console.log(`🏆 Winner decided by lowest payout: ${winner}`);
          
  //         // Generate cards based on winner
  //         let dragonCard, tigerCard;
          
  //         if (winner === "Dragon") {
  //           // Dragon should win - give Dragon a BIG card, Tiger a SMALL card
  //           dragonCard = { value: "K", suit: "♥", display: "K♥" }; // King of Hearts
  //           tigerCard = { value: "3", suit: "♦", display: "3♦" };  // 3 of Diamonds
  //         } else if (winner === "Tiger") {
  //           // Tiger should win - give Dragon a SMALL card, Tiger a BIG card
  //           dragonCard = { value: "3", suit: "♠", display: "3♠" }; // 3 of Spades
  //           tigerCard = { value: "K", suit: "♣", display: "K♣" };  // King of Clubs
  //         } else {
  //           // Tie - both same card value
  //           dragonCard = { value: "8", suit: "♥", display: "8♥" };
  //           tigerCard = { value: "8", suit: "♠", display: "8♠" };
  //         }
          
  //         // Reveal cards immediately
  //         parsed.data.C1 = dragonCard.display;
  //         parsed.data.C2 = tigerCard.display;
  //         parsed.data.card = `${dragonCard.display},${tigerCard.display}`;
  //         parsed.data.result = winner;
  //         parsed.data.winnersString = winner;
          
  //         await redisReplica.set(`dt20`, JSON.stringify(parsed));
  //         console.log(`✅ Round suspended, Cards revealed: C1=${dragonCard.display}, C2=${tigerCard.display}, Winner=${winner}`);
  //       }
  //     }
      
  //     // After 3 seconds, start new round
  //     setTimeout(() => {
  //       console.log("🔄 Starting new round after 3 seconds...");
  //       this.currentLT = this.currentFT; // Reset LT to 20
  //       this.createNewRound();
  //     }, 3000); // 3 second delay
      
  //   } catch (error) {
  //     console.error("Error suspending round:", error);
  //   }
  // };

//   private suspendCurrentRound = async () => {
//   try {
//     const existingData = await redisReplica.get("dt20");
//     if (!existingData) return;

//     const parsed = JSON.parse(existingData);

//     if (!parsed.data || !parsed.data.event_data) return;

//     // ✅ STATUS SUSPEND
//     parsed.data.status = "SUSPENDED";
//     parsed.data.event_data.gstatus = "SUSPENDED";

//     // ✅ ALL MARKETS SUSPEND
//     parsed.data.event_data.market.forEach((m: any) => {
//       m.Runners.forEach((r: any) => {
//         r.gstatus = "SUSPENDED";
//       });
//     });

//     // ✅ RESULT FIX (ONLY 3 MARKETS)
//     const winner = ["Dragon", "Tiger", "Tie"][Math.floor(Math.random() * 3)];

//     let C1 = "K♠", C2 = "3♦";

//     if (winner === "Tiger") {
//       C1 = "3♠";
//       C2 = "K♦";
//     }

//     if (winner === "Tie") {
//       C1 = "8♠";
//       C2 = "8♦";
//     }

//     // ✅ CARD REVEAL
//     parsed.data.event_data.C1 = C1;
//     parsed.data.event_data.C2 = C2;
//     parsed.data.event_data.card = `${C1},${C2}`;
//     parsed.data.event_data.result = winner;

//     parsed.data.card = `${C1},${C2}`;

//     await redisReplica.set("dt20", JSON.stringify(parsed));

//     console.log("🎯 RESULT:", winner);

//     // ⏱️ NEXT ROUND AFTER 3 SEC
//     setTimeout(() => {
//       this.createNewRound();
//     }, 3000);

//   } catch (error) {
//     console.error("❌ suspend error:", error);
//   }
// };

private suspendCurrentRound = async () => {
  try {
    const existingData = await redisReplica.get("dt20");
    if (!existingData) return;

    const parsed = JSON.parse(existingData);

    if (!parsed.data || !parsed.data.event_data) return;

    // ✅ STATUS SUSPEND
    parsed.data.status = "SUSPENDED";
    parsed.data.event_data.gstatus = "SUSPENDED";

    // ✅ ALL MARKETS SUSPEND
    parsed.data.event_data.market.forEach((m: any) => {
      m.Runners.forEach((r: any) => {
        r.gstatus = "SUSPENDED";
      });
    });

    // ✅ RANDOM WINNER
    const winner = ["Dragon", "Tiger", "Tie"][Math.floor(Math.random() * 3)];

    // ✅ CARD VALUES (1–13)
    const values = ["1","2","3","4","5","6","7","8","9","10","J","Q","K"];
    const suits = ["HH","DD","SS","CC"];

    const getRandomValue = () => values[Math.floor(Math.random() * values.length)];
    const getRandomSuit = () => suits[Math.floor(Math.random() * suits.length)];

    let dragonValue: string;
    let tigerValue: string;

    // 🔥 VALUE LOGIC
    if (winner === "Dragon") {
      // Dragon > Tiger
      let dIndex = Math.floor(Math.random() * values.length);
      let tIndex = Math.floor(Math.random() * dIndex); // always smaller

      dragonValue = values[dIndex];
      tigerValue = values[tIndex];

    } else if (winner === "Tiger") {
      // Tiger > Dragon
      let tIndex = Math.floor(Math.random() * values.length);
      let dIndex = Math.floor(Math.random() * tIndex); // always smaller

      tigerValue = values[tIndex];
      dragonValue = values[dIndex];

    } else {
      // Tie (same value)
      dragonValue = tigerValue = getRandomValue();
    }

    // ✅ SUIT LOGIC
    let dragonSuit = getRandomSuit();
    let tigerSuit = getRandomSuit();

    // ❗ Tie me suit alag hone chahiye
    if (winner === "Tie") {
      while (dragonSuit === tigerSuit) {
        tigerSuit = getRandomSuit();
      }
    }

    const C1 = `${dragonValue}${dragonSuit}`;
    const C2 = `${tigerValue}${tigerSuit}`;

    // ✅ CARD REVEAL
    parsed.data.event_data.C1 = C1;
    parsed.data.event_data.C2 = C2;
    parsed.data.event_data.card = `${C1},${C2}`;
    parsed.data.event_data.result = winner;

    // duplicate fields (important)
    parsed.data.card = `${C1},${C2}`;

    await redisReplica.set("dt20", JSON.stringify(parsed));

    console.log("🎯 RESULT:", winner, "|", C1, C2);

    // ⏱️ NEXT ROUND AFTER 3 SEC
    setTimeout(() => {
      this.createNewRound();
    }, 3000);

  } catch (error) {
    console.error("❌ suspend error:", error);
  }
};

  // Load last round from Redis
  private loadLastRound = async () => {
    try {
      const data = await redisReplica.get(`dt20`);
      if (data) {
        const parsed = JSON.parse(data);
        console.log("📂 Loaded last round from Redis");
      }
    } catch (error) {
      console.log("No previous round found, starting fresh");
    }
  };

  // Calculate winner based on lowest payout from bets placed
  private calculateWinnerFromBets = (subMarkets: any[]) => {
    if (!subMarkets || subMarkets.length === 0) {
      return "Dragon"; // Default
    }

    // Find all markets with bets (bs > 0)
    const activeMarkets = subMarkets.filter(m => m.bs && m.bs > 0);
    
    if (activeMarkets.length === 0) {
      return "Dragon"; // Default if no bets
    }

    // Sort by payout (b) ascending - lowest payout first
    activeMarkets.sort((a, b) => a.b - b.b);
    
    // Get the market with lowest payout
    const lowestPayoutMarket = activeMarkets[0];
    
    console.log(`📊 Lowest payout market: ${lowestPayoutMarket.nat} (payout: ${lowestPayoutMarket.b})`);
    
    // Return winner based on market name
    const marketName = lowestPayoutMarket.nat.toLowerCase();
    
    if (marketName.includes("dragon")) {
      return "Dragon";
    } else if (marketName.includes("tiger")) {
      return "Tiger";
    } else if (marketName.includes("tie")) {
      return "Tie";
    } else {
      // For other markets (Pair, Even/Odd, etc.), default to Dragon
      return "Dragon";
    }
  };

  // API endpoint to get current game state
  public getGameState = async (req: Request, res: Response) => {
    try {
      const data = await redisReplica.get(`custom-dt20`);
      if (!data) {
        return this.fail(res, "No active game found");
      }
      return this.success(res, JSON.parse(data));
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  };

  // API endpoint to get round history
  public getHistory = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const recentRounds = this.roundHistory.slice(-limit).reverse();
      return this.success(res, recentRounds);
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  };

  // API endpoint to manually trigger new round (for testing)
  public triggerNewRound = async (req: Request, res: Response) => {
    try {
      await this.createNewRound();
      return this.success(res, { message: "New round created successfully" });
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  };

  // API endpoint to start/stop game
  public toggleGame = async (req: Request, res: Response) => {
    try {
      const { action } = req.body;
      if (action === "start") {
        this.initGame();
        return this.success(res, { message: "Game started" });
      } else if (action === "stop") {
        this.stopTimer();
        return this.success(res, { message: "Game stopped" });
      } else {
        return this.fail(res, "Invalid action. Use 'start' or 'stop'");
      }
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  };
}
