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

interface Props {
  data: IMarket[]
  getMarketBook?: any
  bet?: any
  fancySelectionId?: any
  currentMatch?: IMatch
  setRules: (data: { open: boolean; type: string }) => void
  marketUserBookId?: any
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
    }
  }

  componentDidMount(): void {
    this.socketEvents()
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

  render(): React.ReactNode {
    const { data, getMarketBook } = this.props
    console.log(data ,"markkettjkdsatatat")
    const { runnersData } = this.state
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
              isMobile && market.oddsType != OddsType.BM ? 'box-6' : 'box-4'
            const classforheading = isMobile && market.oddsType != OddsType.BM ? 'box-2' : 'box-1'
            if (!setVisibleMarketStatus) return null
            return (
              <div key={market._id}>
                <div className='market-title mt-1' style={{background:"none", padding:"8px 0px"}}>
                 <span className='bg-theme px-2 py-1' style={{borderTopRightRadius:"10px" , gap:"2px"}}>
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
                </div>
                <div className='table-header'>
                  <div className={`float-left country-name ${classforheadingfirst} min-max`} style={{borderTop:"1px solid #7e97a7"}}>
               <div className='text-center py-1' style={{background:"#bed5d8", borderRadius:"2px"}}><div>Min/Max 100-1000</div></div>
                  </div>
                  {(!isMobile && market.oddsType != OddsType.BM) ||
                    market.oddsType == OddsType.BM ? (
                    <>
                      <div style={{borderColor:"#7e97a7"}} className='box-1 float-left' />
                      <div style={{borderColor:"#7e97a7"}} className='box-1 float-left' />
                    </>
                  ) : (
                    ''
                  )}

                  <div className={`back ${classforheading} float-left text-center`} style={{borderColor:"#7e97a7"}}>
                    <b>BACK</b>
                  </div>
                  <div className={`lay ${classforheading} float-left text-center`} style={{borderColor:"#7e97a7"}} >
                    <b>LAY</b>
                  </div>
                  {!isMobile ? (
                    <>
                      <div className='box-1 float-left' style={{borderColor:"#7e97a7"}} />
                      <div className='box-1 float-left' style={{borderColor:"#7e97a7"}} />
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
                            className={`table-row ${runner.status === 'SUSPENDED' ? 'suspended' : ''
                              }`}
                          >
                            <div className={` country-name ${classforheadingfirst}`} style={{borderColor:"#7e97a7"}}>
                              <span className='team-name'>
                                <b>{runner.runnerName}</b>
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
                                    {getMarketBook[
                                      `${market.marketId}_${runner.selectionId}`
                                    ].toLocaleString()}
                                  </span>
                                ) : (
                                  <span className='' style={{ color: 'black' }}>
                                    {'0'}
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
