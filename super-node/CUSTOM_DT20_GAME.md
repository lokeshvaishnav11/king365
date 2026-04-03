# Custom DT20 Casino Game System

## Overview
This is a custom Dragon Tiger (DT20) casino game system that runs automatically with 20-second rounds. The game generates results based on the **lowest payout** principle, ensuring house advantage.

## Features

✅ **Automatic Round Generation** - New round every 20 seconds  
✅ **Lowest Payout Algorithm** - Results calculated to minimize house payout  
✅ **Redis Integration** - Real-time data storage and publishing  
✅ **Backend Integration** - Automatically saves casino match data to backend  
✅ **Custom Card Logic** - Complete Dragon Tiger card game simulation  
✅ **38 Betting Markets** - All standard DT20 betting options supported  

## Architecture

```
super-node/
├── controllers/api/CustomDt20Controller.ts    # Main game logic
├── routes/index.ts                             # API endpoints
├── App.ts                                      # Game initialization
└── database/redis.ts                           # Redis connection

socket/
└── index.ts                                    # Listens to saveCasinoData channel

backend/
└── src/controllers/CasinoController.ts         # Result settlement
```

## How It Works

### 1. Game Initialization
When super-node starts, the CustomDt20Controller singleton is initialized:
- Loads last round from Redis (if exists)
- Starts 20-second timer
- Creates first round immediately

### 2. Round Creation (Every 20 seconds)
```typescript
createNewRound() {
  1. Generate random Dragon card
  2. Generate random Tiger card
  3. Calculate result using lowest payout algorithm
  4. Generate unique round ID
  5. Save to Redis
  6. Publish to saveCasinoData channel
}
```

### 3. Result Calculation (Lowest Payout Logic)
The system evaluates all possible outcomes and selects the one with the **lowest payout**:

```typescript
Example:
- Dragon: 8♥ (red, even)
- Tiger: 5♠ (black, odd)
- Dragon wins (8 > 5)

Possible winning outcomes:
- "Dragon" pays 2x ✓
- "Dragon Even" pays 2.1x
- "Dragon Red" pays 1.95x ✓
- "Dragon Card 8" pays 12x

Selected result: "Dragon" (lowest payout = 2x)
```

### 4. Data Flow
```
CustomDt20Controller (every 20s)
    ↓
Redis (custom-dt20 key)
    ↓
publish(saveCasinoData)
    ↓
socket/index.ts (subscriber)
    ↓
POST /api/save-casino-match (backend)
    ↓
CasinoGameResult collection
    ↓
Settlement when bets exist
```

## API Endpoints

### Get Current Game State
```bash
GET /api/custom-dt20/state
```

Response:
```json
{
  "status": 200,
  "success": true,
  "data": {
    "mid": "DT20-1712345678901-a1b2c3d4",
    "gameType": "dt20",
    "data": {
      "card": "8♥,5♠",
      "ft": 20,
      "gtype": "dt20",
      "lt": 20,
      "result": "Dragon",
      "C1": "8♥",
      "C2": "5♠",
      "status": "OPEN",
      "sub": [...] // 38 betting markets
    }
  }
}
```

### Get Round History
```bash
GET /api/custom-dt20/history?limit=20
```

### Manually Trigger New Round (Testing)
```bash
POST /api/custom-dt20/new-round
```

### Start/Stop Game
```bash
POST /api/custom-dt20/toggle
{
  "action": "start" // or "stop"
}
```

## Data Format

### Card Structure
```typescript
interface ICard {
  suit: string;        // ♠, ♥, ♦, ♣
  value: string;       // 1, 2-10, J, Q, K
  numericValue: number; // 1-13
  color: "red" | "black";
  isEven: boolean;
}
```

### Round Structure
```typescript
interface IGameRound {
  roundId: string;
  dragonCard: ICard;
  tigerCard: ICard;
  result: string;
  timestamp: Date;
}
```

### Redis Data Format
```javascript
{
  mid: "DT20-timestamp-random",
  gameType: "dt20",
  data: {
    card: "8♥,5♠",           // Dragon,Tiger cards
    ft: 20,                   // First timer (seconds)
    lt: 20,                   // Last timer (seconds)
    gtype: "dt20",
    result: "Dragon",         // Winning outcome
    C1: "8♥",                 // Dragon card
    C2: "5♠",                 // Tiger card
    status: "OPEN",
    sub: [                    // 38 betting markets
      {
        nat: "Dragon",
        sid: 1,
        b: 2,                 // Odds
        min: 100,
        max: 300000,
        gstatus: "OPEN"
      },
      // ... 37 more markets
    ]
  }
}
```

## Betting Markets (38 Total)

### Main Markets (4)
1. **Dragon** - Pays 2x
2. **Tiger** - Pays 2x
3. **Tie** - Pays 50x
4. **Pair** - Pays 12x

### Dragon Side Bets (17)
- Dragon Even/Odd
- Dragon Red/Black
- Dragon Cards 1-13 (A-K)

### Tiger Side Bets (17)
- Tiger Even/Odd
- Tiger Red/Black
- Tiger Cards 1-13 (A-K)

## Payout Hierarchy (Lowest to Highest)

```
1. Dragon/Tiger (main)     - 2x
2. Dragon Even/Odd         - 1.79-2.1x
3. Dragon/Tiger Red/Black  - 1.95x
4. Dragon/Tiger Cards      - 12x
5. Pair                    - 12x
6. Tie                     - 50x
```

The algorithm always selects the **lowest paying** valid outcome.

## Configuration

### Environment Variables (.env)
```bash
PORT=3025
REDIS_URL_REPLICA=redis://localhost:6379
CASINO_SERVER=http://your-backend-server:port
```

### Timer Interval
To change the round duration, modify in `CustomDt20Controller.ts`:
```typescript
this.timerInterval = setInterval(() => {
  this.createNewRound();
}, 20000); // Change 20000 to desired milliseconds
```

## Testing

### 1. Start the Server
```bash
cd super-node
npm start
```

You should see:
```
🎮 Initializing Custom DT20 Game System...
⏱️  Timer started: New round every 20 seconds
🎲 Creating new round...
✅ Round DT20-... created
💾 Round saved to Redis
🎮 Custom DT20 Casino Game initialized!
```

### 2. Check Current Round
```bash
curl http://localhost:3025/api/custom-dt20/state
```

### 3. Watch Redis
```bash
redis-cli
> GET custom-dt20
> SUBSCRIBE saveCasinoData
```

### 4. Manual Round Trigger
```bash
curl -X POST http://localhost:3025/api/custom-dt20/new-round
```

## Backend Integration

The system automatically integrates with your existing backend:

1. **Socket Listener** (`socket/index.ts`)
   - Subscribes to `saveCasinoData` Redis channel
   - Receives new round data
   - POSTs to `/api/save-casino-match`

2. **Backend Endpoint** (`CasinoController.ts`)
   - Saves to `CasinoGameResult` collection
   - Marks as "processing"
   - Settles pending bets when round ends

3. **Result Settlement**
   - Uses existing `setPendingResult()` logic
   - Calculates PnL for all users
   - Updates balances and account statements

## House Edge Strategy

The lowest-payout algorithm ensures:
- ✅ House always pays minimum necessary
- ✅ High-paying outcomes (Tie, Pair) rarely selected
- ✅ Consistent profitability
- ✅ Fair gameplay (random cards, deterministic results)

### Example Scenarios

**Scenario 1: Clear Winner**
```
Dragon: K♥ (13)
Tiger: 2♠ (2)
Result: "Dragon" (pays 2x)
// Instead of "Dragon Card K" (pays 12x)
```

**Scenario 2: Color Bet Lower**
```
Dragon: 6♦ (red, even)
Tiger: 3♣ (black, odd)
Winning outcomes: Dragon, Dragon Even, Dragon Red
Result: "Dragon Red" (pays 1.95x)
// Lower than "Dragon" (2x)
```

**Scenario 3: Tie Situation**
```
Dragon: 8♠
Tiger: 8♥
Winning outcomes: Tie, Pair
Result: "Pair" (pays 12x)
// Lower than "Tie" (50x)
```

## Monitoring

### Check Logs
```bash
# View game logs
tail -f super-node/logs/app.log | grep "DT20"

# Monitor round creation
tail -f super-node/logs/app.log | grep "Creating new round"
```

### Redis Commands
```bash
# Get current round
GET custom-dt20

# Get round history (last 100 stored in memory)
# Check application logs instead

# Monitor real-time updates
SUBSCRIBE saveCasinoData
```

## Troubleshooting

### Game Not Starting
- Check Redis connection
- Verify environment variables
- Check console logs for errors

### Rounds Not Generating
- Ensure timer is running: check logs for "Timer started"
- Verify Redis is saving: look for "Round saved to Redis"
- Check interval: should log every 20 seconds

### Backend Not Receiving Data
- Verify socket connection
- Check `saveCasinoData` subscriber
- Test endpoint: `POST /api/save-casino-match`

## Performance Considerations

- **Memory**: Stores last 100 rounds in memory (~50KB)
- **Redis**: Single key update every 20 seconds
- **CPU**: Minimal - simple card generation and comparison
- **Network**: One publish per round to Redis

## Security Notes

⚠️ **Important**: This system uses a house-favoring algorithm. Ensure compliance with:
- Local gambling regulations
- Platform terms of service
- User transparency requirements

## Future Enhancements

- [ ] Configurable house edge percentage
- [ ] Multiple game instances (dt20-1, dt20-2, etc.)
- [ ] Advanced statistics tracking
- [ ] Hot/cold streak analysis
- [ ] User-facing round history API
- [ ] Admin dashboard for game controls

## Support

For issues or questions:
1. Check logs first
2. Verify Redis connectivity
3. Test API endpoints individually
4. Review data flow diagram

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Author**: Custom Casino System
