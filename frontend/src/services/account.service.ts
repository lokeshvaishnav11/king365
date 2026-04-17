import api from '../utils/api'

class AccountService {
  getAccountList(page: number, filter: any) {
    return api.post(`account-statement-list?page=${page}`, filter)
  }
  getProfitLoss(page: number, filter: any) {
    return api.post(`profit-loss?page=${page}`, filter)
  }


    getBets22(matchId: number) {
    return api.get(`bets22?matchId=${matchId}`);
  }

  allbetsdata() {
    return api.get(`allbetsdata`);
  }


}
export default new AccountService()
