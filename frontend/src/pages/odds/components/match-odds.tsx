/* eslint-disable */
import IMarket, { OddsType } from '../../../models/IMarket'
import React, { MouseEvent } from 'react'
import IRunner from '../../../models/IRunner'
import { SocketContext } from '../../../context/webSocket'
import { AvailableToBackLay } from './available-to-back-lay'
import { betPopup } from '../../../redux/actions/bet/betSlice'
import { connect } from 'react-redux'
import PnlCalculate from './pnl-calculate'
// import { checkoddslength } from '../../../utils/helper'
import { isMobile } from 'react-device-detect'
import BookPopup from './fancy/book-popup'
import IMatch from '../../../models/IMatch'
import { setRules } from '../../../redux/actions/common/commonSlice'
import UserBookPopup from './user-book-popup'
import PlaceBetBoxMatchodds from './place-bet-box-matchodds'
import { IUserBetStake } from '../../../models/IUserStake'


interface Props {
  data: IMarket[]
  getMarketBook?: any
  bet?: any
  fancySelectionId?: any
  currentMatch?: IMatch
  setRules: (data: { open: boolean; type: string }) => void
  marketUserBookId?: any
  betPopup: any
  marketDataList?: any
}

class MatchOdds extends React.PureComponent<
  Props,
  {
    runnersData: any
    runnersDataPrev: any
    profitLoss: any
    getMarketBook: any
    remarkMarket: any
    runnersName: Record<string, string>
    cashoutPreview: any
    marketDataList: any
  }
> {
  static contextType = SocketContext
  context!: React.ContextType<typeof SocketContext>
  constructor(props: Props) {
    super(props)
    const selections: any = {}
    const profitLoss: any = {}
    const remarkMarket: any = {}
    let runnersName: any = {}
    props.data.forEach(async (market: IMarket) => {
      market.runners.forEach((runner: IRunner) => {
        runnersName = {
          ...runnersName,
          [market.marketId]: {
            ...runnersName[market.marketId],
            [runner.selectionId]: runner.runnerName,
          },
        }
        selections[market.marketId] = market
        profitLoss[runner.selectionId] = 0
      })
      remarkMarket[market.marketId] = ''
    })
    this.state = {
      runnersData: selections,
      runnersDataPrev: JSON.parse(JSON.stringify(selections)),
      profitLoss,
      getMarketBook: props.getMarketBook,
      remarkMarket: remarkMarket,
      runnersName: runnersName,
      cashoutPreview: null,
      marketDataList: props.marketDataList,
    }
  }


  componentDidMount(): void {
    this.socketEvents()
  console.log(this.props,"currentMatrfrrch")

  }

  componentWillUnmount(): void {
    this.context.socket.off('getMarketData')
    this.leaveMarketRoom()
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.data !== this.props.data) {
      this.socketEvents()
    }
  }

  socketEvents = () => {
    this.leaveMarketRoom()
    this.joinMarketRoom()
    this.getSocketEvents()
    this.context.socket.on('connect', () => {
      this.joinMarketRoom()
    })
    this.context.socket.on('reconnect', () => {
      this.joinMarketRoom()
    })
  }

  joinMarketRoom = () => {
    if (this.props.currentMatch) {
      this.context.socket.emit('joinRoom', this.props.currentMatch.matchId)
    }
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit('joinMarketRoom', market.marketId)
    })
  }

  leaveMarketRoom = () => {
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit('leaveRoom', market.marketId)
      this.context.socket.emit('leaveRoom', market.matchId)
    })
  }

  getSocketEvents = () => {
    const handler = (market: IMarket) => {
      this.setState((prev) => ({
        runnersData: { ...prev.runnersData, [market.marketId]: market },
      }))
    }
    this.context.socket.on('getMarketData', handler)
  }

  offplaylimit = (market: any) => {
    const inplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.inPlayBookMaxLimit
        : this.props.currentMatch?.inPlayMaxLimit
    const offplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.offPlayBookMaxLimit
        : this.props.currentMatch?.offPlayMaxLimit
    return this.props.currentMatch?.inPlay ? inplayl : offplayl
  }






  // handleCashout = (market: any) => {
  //   const { currentMatch, getMarketBook, betPopup } = this.props;

  //   console.log("🚀 CASHOUT CLICKED");

  //   if (!currentMatch) return console.log("❌ No currentMatch");
  //   if (!getMarketBook) return console.log("❌ No getMarketBook");
  //   if (!market?.runners?.length) return console.log("❌ No runners");

  //   // ✅ HELPER: correct odds pick
  //   const getValidBackOdds = (runner: any) => {
  //     const backs = runner?.ex?.availableToBack || [];
  //     for (let i = backs.length - 1; i >= 0; i--) {
  //       if (backs[i]?.price > 1 && Number(backs[i]?.size) > 0) {
  //         return backs[i].price;
  //       }
  //     }
  //     return null;
  //   };

  //   const getValidLayOdds = (runner: any) => {
  //     const lays = runner?.ex?.availableToLay || [];
  //     for (let i = 0; i < lays.length; i++) {
  //       if (lays[i]?.price > 1 && Number(lays[i]?.size) > 0) {
  //         return lays[i].price;
  //       }
  //     }
  //     return null;
  //   };

  //   // ✅ STEP 1: Build PNL MAP
  //   const pnlMap: Record<number, number> = {};

  //   market.runners.forEach((runner: any) => {
  //     const key = `${market.marketId}_${runner.selectionId}`;
  //     pnlMap[runner.selectionId] = Number(getMarketBook?.[key] ?? 0);
  //   });

  //   console.log("📊 PNL MAP:", pnlMap);

  //   const values = Object.entries(pnlMap);
  //   if (values.length < 2) return console.log("❌ Not enough runners");

  //   // ✅ STEP 2: Find PROFIT & LOSS
  //   const positive = values.reduce((max, curr) =>
  //     curr[1] > max[1] ? curr : max
  //   );

  //   const negative = values.reduce((min, curr) =>
  //     curr[1] < min[1] ? curr : min
  //   );

  //   const profitSelectionId = Number(positive[0]);
  //   const lossSelectionId = Number(negative[0]);

  //   const positivePnl = positive[1];
  //   const negativePnl = negative[1];

  //   console.log("📈 Profit:", positivePnl, "📉 Loss:", negativePnl);

  //   // ❌ no hedge needed
  //   if (positivePnl <= 0) {
  //     console.log("❌ No profit → skip");
  //     return;
  //   }

  //   // ✅ STEP 3: LIVE MARKET
  //   const liveMarket = this.state.runnersData?.[market.marketId];
  //   if (!liveMarket) return console.log("❌ No live market");

  //   const profitRunner = liveMarket.runners?.find(
  //     (r: any) => r.selectionId === profitSelectionId
  //   );

  //   const lossRunner = liveMarket.runners?.find(
  //     (r: any) => r.selectionId === lossSelectionId
  //   );

  //   if (!profitRunner || !lossRunner) {
  //     console.log("❌ Runner not found");
  //     return;
  //   }

  //   console.log("🎯 Profit Runner:", profitRunner.runnerName);
  //   console.log("🎯 Loss Runner:", lossRunner.runnerName);

  //   // ✅ STEP 4: GET CORRECT ODDS
  //   const profitBackOdds = getValidBackOdds(profitRunner);
  //   const lossBackOdds = getValidBackOdds(lossRunner);

  //   if (!profitBackOdds || !lossBackOdds) {
  //     console.log("❌ Valid odds not found");
  //     return;
  //   }

  //   console.log("🎯 ProfitOdds:", profitBackOdds);
  //   console.log("🎯 OppositeOdds:", lossBackOdds);

  //   // ✅ STEP 5: ORIGINAL STAKE (IMPORTANT)
  //   // ⚠️ ideally DB se lo (exact bet amount)
  //   let originalStake = Math.abs(negativePnl);

  //   // 🛑 SAFETY FIX (avoid huge wrong stake)
  //   if (originalStake > 10000) {
  //     console.log("⚠️ Adjusting unrealistic stake");
  //     originalStake = originalStake / 2;
  //   }

  //   console.log("💰 Original Stake:", originalStake);

  //   // ✅ STEP 6: FINAL HEDGE FORMULA
  //   let hedgeStack = (originalStake * profitBackOdds) / lossBackOdds;

  //   if (!isFinite(hedgeStack) || hedgeStack <= 0) {
  //     console.log("❌ Invalid hedge");
  //     return;
  //   }

  //   const finalStack = Number(hedgeStack.toFixed(2));

  //   console.log("🔥 FINAL STACK:", finalStack);

  //   // ✅ STEP 7: TRIGGER CASHOUT (BACK opposite)
  //   betPopup({
  //     isOpen: true,
  //     betData: {
  //       betOn: "MATCH_ODDS",
  //       marketId: market.marketId,
  //       matchId: currentMatch.matchId,

  //       marketName: market.marketName,
  //       oddsType: market.oddsType,

  //       selectionId: lossRunner.selectionId,
  //       selectionName: lossRunner.runnerName,

  //       matchName: currentMatch.name,

  //       odds: lossBackOdds,
  //       stack: finalStack,

  //       pnl: 0,
  //       exposure: -finalStack,

  //       isBack: true,
  //       type: "CASHOUT",
  //     },
  //   });

  //   console.log("✅ CASHOUT SUCCESS");
  // };

  


  handleCashout = (market: any) => {
    const { currentMatch, getMarketBook, betPopup } = this.props;
    const { cashoutPreview } = this.state;

    console.log("🚀 CASHOUT CLICKED" );

    if (!currentMatch || !getMarketBook || !market?.runners?.length) {
      console.log("❌ Missing data");
      return;
    }

    // ✅ If already preview exists → PLACE BET
    if (cashoutPreview && cashoutPreview.marketId === market.marketId) {
      console.log("✅ SECOND CLICK → PLACING BET");

      // 👉 DIRECT BET (NO POPUP)
      betPopup({
        isOpen: true, // ❌ popup band
        betData: {
          ...cashoutPreview.betData,
          autoConfirm: true, // 👈 backend me handle kar lena
        },
      });

      // reset preview
      this.setState({ cashoutPreview: null });

      return;
    }

    // =========================
    // ✅ FIRST CLICK → CALCULATE
    // =========================

    const pnlMap: Record<number, number> = {};



    market.runners.forEach((runner: any) => {
      const key = `${market.marketId}_${runner.selectionId}`;
      pnlMap[runner.selectionId] = Number(getMarketBook?.[key] ?? 0);
    });

    const values = Object.entries(pnlMap);
    if (values.length < 2) return;

    const positive = values.reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    );

    const negative = values.reduce((min, curr) =>
      curr[1] < min[1] ? curr : min
    );

    const profitSelectionId = Number(positive[0]);
    const lossSelectionId = Number(negative[0]);

    const positivePnl = positive[1];
    const negativePnl = negative[1];

    console.log("📈 Profit:", positivePnl, "📉 Loss:", negativePnl);

    if (positivePnl <= 0) {
      console.log("❌ No profit");
      return;
    }

    const liveMarket = this.state.runnersData?.[market.marketId];
    if (!liveMarket) return;

    const profitRunner = liveMarket.runners.find(
      (r: any) => r.selectionId === profitSelectionId
    );

    const lossRunner = liveMarket.runners.find(
      (r: any) => r.selectionId === lossSelectionId
    );

    if (!profitRunner || !lossRunner) return;

    // ✅ EXACT ODDS PICK (TERA RULE)
    const profitOdds = profitRunner.ex?.availableToBack?.[2]?.price;
    const oppositeOdds = lossRunner.ex?.availableToBack?.[2]?.price;

    if (!profitOdds || !oppositeOdds) {
      console.log("❌ Odds missing");
      return;
    }

    console.log("🎯 ProfitOdds:", profitOdds);
    console.log("🎯 OppositeOdds:", oppositeOdds);

    // ✅ ORIGINAL BET STAKE (correct logic)
    const originalStake = Math.abs(negativePnl);

    // ✅ HEDGE FORMULA (CORRECT)
    const hedgeStack = (originalStake * profitOdds) / oppositeOdds;

    const finalStack = Number(hedgeStack.toFixed(2));

    console.log("🔥 Hedge Stack:", finalStack);

    // ✅ CALCULATE FINAL LOSS
    const finalLoss =
      finalStack * oppositeOdds - finalStack - originalStake;

    console.log("💀 Final Loss:", finalLoss );

    // SAVE PREVIEW
    this.setState({
      cashoutPreview: {
        marketId: market.marketId,
        loss: Number(finalLoss.toFixed(2)),
        betData: {
          betOn: "MATCH_ODDS",
          marketId: market.marketId,
          matchId: currentMatch.matchId,

          marketName: market.marketName,
          oddsType: market.oddsType,

          selectionId: lossRunner.selectionId,
          selectionName: lossRunner.runnerName,

          matchName: currentMatch.name,

          odds: oppositeOdds,
          stack: finalStack,

          pnl: 0,
          exposure: -finalStack,

          isBack: true,
          type: "CASHOUT",
        },
      },
    });

    console.log("🟡 PREVIEW READY → CLICK AGAIN TO CONFIRM");
  };
  
  render(): React.ReactNode {
    const { data, getMarketBook } = this.props
    const { runnersData } = this.state
    const preview = this.state.cashoutPreview;
    return (
      <div>
        {data &&
          data.map((market: IMarket) => {
            const selectionsPrev: any = {}
            const oddsData = runnersData ? runnersData[market.marketId] : null
            let setVisibleMarketStatus = true
            if (oddsData) {
              setVisibleMarketStatus = !!oddsData?.['runners']?.[0]?.ex
            }
            const classforheadingfirst =
              isMobile && market.oddsType != OddsType.BM ? 'box-6' : 'box-6'
            const classforheading = isMobile && market.oddsType != OddsType.BM ? 'box-2' : 'box-2'
            if (!setVisibleMarketStatus) return null
            return (
              <div key={market._id}>
                <div className='market-title mt-1' style={{ background: "none", padding: "8px 0px" }}>
                  <span className='bg-theme px-2 py-1' style={{ borderTopRightRadius: "10px", background: "linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)", gap: "2px", fontSize: "12px", fontWeight: "700" }}>
                    {market.marketName}
                    <a
                      href='#Bookmaker-market'
                      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        this.props.setRules({
                          open: true,
                          type: market.oddsType === OddsType.BM ? 'Bookmaker' : market.oddsType,
                        })
                      }}
                      className='m-l-5 game-rules-icon'
                    >
                      <span>
                        <i className='fa fa-info-circle float-righ' />
                      </span>
                    </a> </span>
                  {/* <span className='float-right m-r-10'>
                    Maximum Bet <span>{this.offplaylimit(market)}</span>
                  </span> */}
                  <span
                    className='text-dark ml-1'
                    style={{ fontSize: "11px", cursor: "pointer" }}
                    onClick={() => this.handleCashout(market)}
                  >

                    {preview && preview.marketId === market.marketId ? (
                      <span style={{ color: "red" }}>
                        ✔ {preview.loss}
                      </span>
                    ) : (
                      <span className='text-dark ml-1'><span className='bg-warning rounded px-1' style={{ paddingBottom: "3px" }}><i style={{ fontSize: "x-small" }} className='fa fa-circle' /></span> Cash out</span>

                    )}

                  </span>            </div>
                <div className='table-header'>
                  <div className={`float-left country-name ${classforheadingfirst} min-max`} style={{ borderTop: "1px solid #7e97a7" }}>
                    <div className='text-center py-1' style={{ background: "#bed5d8", borderRadius: "3px" }}><div><span style={{ color: "#315195", fontSize: "10px", fontWeight: "700" }}>Min/Max</span> <span style={{ fontSize: "10px", fontWeight: "700" }}>100-1000</span></div></div>
                  </div>
                  {/* {(!isMobile && market.oddsType != OddsType.BM) ||
                    market.oddsType == OddsType.BM ? (
                    <>
                      <div className='box-1 float-left' style={{ borderRight: "none", borderTop: "1px solid #7e97a7" }} />
                      <div className='box-1 float-left' style={{ borderRight: "none", borderLeft: "none", borderTop: "1px solid #7e97a7" }} />
                    </>
                  ) : (
                    ''
                  )} */}

                  <div className={`back ${classforheading} float-left text-center`} style={{ borderColor: "#7e97a7" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>Back</span>
                  </div>
                  <div className={`lay ${classforheading} float-left text-center`} style={{ borderColor: "#7e97a7" }} >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>Lay</span>
                  </div>
                  <>
                    <div className='box-1 float-left' style={{ borderRight: "none", borderTop: "1px solid #7e97a7" }} />
                    <div className='box-1 float-left' style={{ borderRight: "none", borderLeft: "none", borderTop: "1px solid #7e97a7" }} />
                  </>
                  {!isMobile ? (
                    <>
                      <div className='box-1 float-left' style={{ borderColor: "#7e97a7" }} />
                      <div className='box-1 float-left' style={{ borderColor: "#7e97a7" }} />
                    </>
                  ) : (
                    ''
                  )}
                </div>
                {oddsData &&
                  oddsData?.runners
                    ?.sort((a: any, b: any) => a?.sortPriority - b?.sortPriority)
                    .map((runner: IRunner) => {
                      runner = {
                        ...runner,
                        runnerName: this.state.runnersName?.[market.marketId]?.[runner.selectionId],
                      }
                      return (
                        <div key={runner.selectionId}>

                          <div
                            data-title={runner.status}
                            className={`table-row ${runner.status === 'SUSPENDED' ? 'suspended' : ''}`}
                            style={
                              market.oddsType === OddsType.BM
                                ? { background: "#f6efd5" } // 👈 cream bg like image
                                : {}
                            }
                          >
                            <div className={` country-name ${classforheadingfirst}`} style={{ borderColor: "#7e97a7" }}>
                              <span className='team-name'>
                                <span style={{ fontSize: "13px", fontWeight: "700" }}>{runner.runnerName}</span>
                              </span>
                              <p>
                                {getMarketBook[`${market.marketId}_${runner.selectionId}`] ? (
                                  <span
                                    className={
                                      getMarketBook[`${market.marketId}_${runner.selectionId}`] > 0
                                        ? 'green'
                                        : 'blue'
                                    }
                                  >
                                    ( {getMarketBook[
                                      `${market.marketId}_${runner.selectionId}`
                                    ].toLocaleString()} )
                                  </span>
                                ) : (
                                  <span className='' style={{ color: 'black' }}>

                                  </span>
                                )}

                                <PnlCalculate
                                  marketId={market.marketId}
                                  selectionId={runner.selectionId}
                                />
                              </p>
                            </div>
                            <AvailableToBackLay
                              selections={runner.ex}
                              selectionsPrev={selectionsPrev}
                              market={market}
                              runner={runner}
                            />
                           
                          </div>
                        </div>   
                      )
                      
                    })}
                       {this?.state?.marketDataList?.stake && this.props.bet?.betData?.marketId === market.marketId &&  <PlaceBetBoxMatchodds stake={this?.state?.marketDataList?.stake} />}


                {this.state.remarkMarket[market.marketId] ? (
                  <div className='table-remark text-right remark'>
                    {this.state.remarkMarket[market.marketId]}
                  </div>
                ) : (
                  ''
                )}
              </div>
            )
          })}

        {this.props.fancySelectionId && <BookPopup />}
        {this.props.marketUserBookId && <UserBookPopup />}
      </div>
    )
  }
}
const mapStateToProps = (state: any) => ({
  bet: state.betReducer.bet,
  getMarketBook: state.betReducer.userBookMarketList,
  fancySelectionId: state.betReducer.fancyMatchAndSelectionId,
  currentMatch: state.sportReducer.currentMatch,
  marketUserBookId: state.betReducer.marketBookAndSelectionId,
})

const actionCreators = {
  betPopup,
  setRules,
}
export default connect(mapStateToProps, actionCreators)(MatchOdds)
