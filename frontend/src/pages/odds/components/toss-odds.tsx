import React, { MouseEvent } from 'react'
import authService from '../../../services/auth.service';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { betPopup, selectBetPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import PlaceBetBoxMatchodds from './place-bet-box-matchodds';

const TossOdds = ({matchName, marketDataList}:any) => {

    console.log(matchName,"matchName")
      const dispatch = useAppDispatch()
    

    const teams = matchName ? matchName?.split(/\s+v(?:s)?\s+/i) : [];
  const teamA = teams[0]?.trim() || "Team A";
  const teamB = teams[1]?.trim() || "Team B";


const betValues = useAppSelector(selectBetPopup)



    const onBet = (isBack = false, back: { price: number; size: number }) => {
      const ipAddress = authService.getIpAddress()
    //   if (market.oddsType == OddsType.BM && back.size == 0) return
    //   if (back.price > 0 && back.size && userState.user.role === RoleType.user)
         {
        dispatch(
          betPopup({
            isOpen: true,
            betData: {
              isBack,
              odds: parseFloat(back.price.toFixed(4)),
              volume: back.size,
              marketId: "343453",
              marketName: "Toss",
              matchId: 343453,
              selectionName: "Toss",
              selectionId: 343453,
              pnl: 0,
              stack: 0,
              currentMarketOdds: back.price,
              eventId: 4,
              exposure: -0,
              ipAddress: ipAddress,
              type: IBetType.Match,
              matchName: matchName,
              betOn: IBetOn.FANCY,
              oddsType: "MATCH",
            },
          }),
        )
      }
    }

  return (
      <><div className='market-title mt-1' style={{ background: "none", padding: "8px 0px" }}>
          <span className=' px-2 py-1' style={{ borderTopRightRadius: "10px", gap: "2px",background:"linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)",fontSize: "12px", fontWeight: "700"}}>
              Who will win the toss
              <a
                  href='#Bookmaker-market'
                  //    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  //      e.preventDefault()
                  //      this.props.setRules({
                  //        open: true,
                  //        type: market.oddsType === OddsType.BM ? 'Bookmaker' : market.oddsType,
                  //      })
                  //    }}
                  className='m-l-5 game-rules-icon'
              >
                  <span>
                      <i className='fa fa-info-circle float-righ' />
                  </span>
              </a> </span>
          {/* <span className='float-right m-r-10'>
      Maximum Bet <span>{this.offplaylimit(market)}</span>
    </span> */}
          {/* <span className='text-dark ml-1' style={{fontSize: "11px",}}><span className='bg-warning rounded px-1' style={{ paddingBottom: "3px" }}><i style={{ fontSize: "x-small" }} className='fa fa-circle' /></span> Cash out</span> */}
      </div><div
          className="container-fluid p-2"
          style={{
              background: "linear-gradient(90deg,#82dda6cc,#82ddb059 49%,#82dda6cc)",
          }}
      >
              <div className="row text-center align-items-center">

                  {/* LEFT TEAM */}
                  <div className="col-6">
                      <span style={{fontSize:"12px",fontWeight:"700"}}>{teamA}</span>

                      <div
                      onClick={() => onBet(true, { price: 1.98, size: 3 })}
                          style={{
                              border: "1px solid white",
                              borderRadius: "3px",
                              padding: "2px 0",
                              backgroundColor: "#72e3a0",
                              color: "#000",
                              fontWeight: "700",
                              width: "62%",
                              margin: "0 auto",
                          }}
                      >
                          <div style={{ fontSize: "12px",fontWeight:"700" }}>
                              { "1.98"}
                          </div>
                          <div style={{ fontSize: "11px" ,fontWeight:"300" }}>3M</div>
                      </div>
                  </div>

                  {/* RIGHT TEAM */}
                  <div className="col-6">
                     <span style={{fontSize:"12px",fontWeight:"700"}}>{teamB}</span>

                      <div
                      onClick={() => onBet(true, { price: 1.98, size: 3 })}
                           style={{
                              border: "1px solid white",
                              borderRadius: "3px",
                              padding: "2px 0",
                              backgroundColor: "#72e3a0",
                              color: "#000",
                              fontWeight: "700",
                              width: "62%",
                              margin: "0 auto",
                          }}
                      >
                          <div style={{ fontSize: "12px",fontWeight:"700" }}>
                              {"1.98"}
                          </div>
                          <div style={{ fontSize: "11px",fontWeight:"300" }}>3M</div>
                      </div>
                  </div>

              </div>
             
          </div>{marketDataList?.stake &&
  betValues?.betData?.marketName === "Toss" && <PlaceBetBoxMatchodds stake={marketDataList?.stake} />}
              </>
  )
}

export default TossOdds