#!/bin/bash

# Test script for Custom DT20 Casino Game System

echo "🎮 Testing Custom DT20 Casino Game System"
echo "=========================================="
echo ""

# Configuration
BASE_URL="${API_URL:-http://localhost:3025}"

echo "Using API URL: $BASE_URL"
echo ""

# Test 1: Get Current Game State
echo "📋 Test 1: Getting current game state..."
curl -s "$BASE_URL/api/custom-dt20/state" | jq '.'
echo ""
sleep 2

# Test 2: Manually trigger new round
echo "🎲 Test 2: Triggering new round manually..."
curl -s -X POST "$BASE_URL/api/custom-dt20/new-round" | jq '.'
echo ""
sleep 1

# Test 3: Get updated game state
echo "📋 Test 3: Getting updated game state..."
curl -s "$BASE_URL/api/custom-dt20/state" | jq '.data.data | {card, result, C1, C2}'
echo ""
sleep 1

# Test 4: Get round history
echo "📊 Test 4: Getting round history (last 5)..."
curl -s "$BASE_URL/api/custom-dt20/history?limit=5" | jq '.[] | {roundId, result, dragonCard: .dragonCard.value, tigerCard: .tigerCard.value}'
echo ""

# Test 5: Verify data structure
echo "✅ Test 5: Verifying data structure..."
RESPONSE=$(curl -s "$BASE_URL/api/custom-dt20/state")

if echo "$RESPONSE" | jq -e '.status == 200' > /dev/null; then
    echo "✓ Status code is correct"
else
    echo "✗ Status code is incorrect"
fi

if echo "$RESPONSE" | jq -e '.data.mid' > /dev/null; then
    echo "✓ Round ID exists"
else
    echo "✗ Round ID missing"
fi

if echo "$RESPONSE" | jq -e '.data.data.card' > /dev/null; then
    echo "✓ Card data exists"
else
    echo "✗ Card data missing"
fi

if echo "$RESPONSE" | jq -e '.data.data.sub | length == 38' > /dev/null; then
    echo "✓ All 38 betting markets present"
else
    echo "✗ Betting markets incomplete"
fi

echo ""
echo "=========================================="
echo "✨ Testing complete!"
echo ""
echo "💡 Tips:"
echo "  - Watch logs: tail -f logs/app.log | grep 'DT20'"
echo "  - Monitor Redis: redis-cli SUBSCRIBE saveCasinoData"
echo "  - Check current round: curl $BASE_URL/api/custom-dt20/state"
echo ""
