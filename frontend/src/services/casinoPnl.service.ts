import axios from 'axios';

/**
 * Get PnL for all runners in a casino round
 * @param roundId - The round/market ID
 * @returns Record<runnerName, pnl>
 */
export const getCasinoRoundPnL = async (roundId: string) => {
  try {
    console.log('🔵 Fetching PnL for round:', roundId);
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/casino-round-pnl`, {
      params: { roundId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('🟢 PnL Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching casino PnL:', error);
    return { pnl: {} };
  }
};

export default {
  getCasinoRoundPnL
};
