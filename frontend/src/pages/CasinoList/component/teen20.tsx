import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import React, { useState } from 'react';
import CasinoPnl from './casinoPnl';
import Limitinfo from './_common/limitinfo';

const TeenPatti20 = (props: any) => {
  const { lastOdds, liveMatchData, defaultNewData } = props
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch)
  const [updateOdds, setUpdateOdds] = useState<any>(undefined)

  const clsstatus2 = defaultNewData.status == "result" || defaultNewData.status == "dealing" ? "suspendedteen" : '';

  const onBet = (isBack = false, item: any) => {
    console.log(item, "chchhc")
    const ipAddress = authService.getIpAddress()
    if (userState.user.role === RoleType.user) {
      // const oddsVal = parseFloat(isBack ? item.rate : item.rate);
      // if (oddsVal <= 0) return
      if (defaultNewData.status == 'result') return
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: item.aValue,
            volume: 100,
            marketId: defaultNewData.roundId,
            marketName: "Teen20",
            matchId: defaultNewData?.roundId || 0,
            selectionName: item.title,
            selectionId: parseInt(defaultNewData.roundId),
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b1 : item.l1,
            eventId: defaultNewData.roundId,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: "Teen 20 20",
            betOn: IBetOn.CASINO,
            gtype: "teen20",
          },
        }),
      )
    }
  }
  const laybacklayout = () => {
    const clsnamehead = ''
    const clsnamename = ''
    const heightdata = ''
    return ([1].map((ItemIndex: any, key: number) => {
      const ItemNew = liveMatchData?.defaultMarkets?.[ItemIndex].Runners?.[0] || {}
      const Item: any = lastOdds?.[ItemNew.SelectionId] || {}
      const clsstatus = defaultNewData.status == "result" ? "suspended" : '';
      const otherMarket = liveMatchData?.defaultMarkets?.[key + 2]?.Runners[0] || {}
      const ItemOther: any = lastOdds?.[otherMarket.SelectionId] || {}

      return (
        (
          <div key={key} className={` ${heightdata} d-flex align-items-center flex-column ${clsstatus2} `} style={{ border: "none" }} >

            <span className={clsnamehead} style={{ paddingLeft: "10px", border: "none" }} >
              {/* <b>{ItemNew.RunnerName}</b> */}
              <b style={{ border: "none" }}>{"Player A"}</b>

            </span>
            <div className={`back teen-section  ${clsnamename}`} style={{
              borderRadius: "5px", boxShadow: "0 2px 7px 1px #67828be6", width: "100", marginBottom: "5px"

            }}>
              <button className='back' onClick={() => onBet(true, 1.98)} >
                <span className='odd'>{1.98}</span>{' '}
                <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData?.match_id} classData={'text-center'} />
              </button>
            </div>
            {/* <td className={`back teen-section box-4 ${clsstatus2}`}>
              <button className='back' onClick={() => onBet(true, ItemOther)}>
                <span className='odd'>
                  <b>{otherMarket.RunnerName}</b>
                </span>{' '}
                <CasinoPnl sectionId={otherMarket.SelectionId} matchId={liveMatchData?.match_id} classData={'text-center'} />
              </button>
            </td> */}
          </div>
        )
      )
    })
    )
  }
  const [showMinmax, setShowMinmax] = React.useState(false);


  const gameData = [
    {
      title: "WINNER",
      playerA: "PLAYER A",
      playerB: "PLAYER B",
      aValue: 1.98,
      bValue: 1.98,
      aAmount: 1917956,
      bAmount: 2091970
    },
    {
      title: "FLUSH",
      playerA: "PLAYER A (FLUSH)",
      playerB: "PLAYER B (FLUSH)",
      aValue: 8,
      bValue: 8,
      aAmount: 500000,
      bAmount: 500000
    },
    {
      title: "STRAIGHT (ROW)",
      playerA: "PLAYER A (STRAIGHT)",
      playerB: "PLAYER B (STRAIGHT)",
      aValue: 14,
      bValue: 14,
      aAmount: 300000,
      bAmount: 300000
    }
  ];

  return (
    <div className=' '>
      <div className='row casino-32A d-none '>
        <div className='col-lg-12 m-b-10 main-market  bg-gray' style={{ padding: '0px' }}>
          <div className='live-poker'>
            <div className='table coupon-table table table-bordered suspendwidth' >
              <div style={{ borderBottom: "0px" }}>
                <div>
                  {/* <th className={'box-4'} style={{ paddingLeft: "10px" }}>
                    <Limitinfo nameString={'lbmarket'} min={100} max={50000} />
                  </th> */}
                  {/* <th className={`back ${"box-2"}`}>Back</th> */}
                  {/* <th className={`back ${"box-4"}`}></th> */}
                </div>
              </div>
              <div className="d-flex justify-content-between p-2 mb-2 bg-theme text-white rounded" style={{background:"linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)"}}><span>WINNER</span><div>{showMinmax && <span className='bg-dark rounded px-1'>Min/Max: 100 - 100000 </span>} <i onClick={() => setShowMinmax(!showMinmax)} className="fa fa-info-circle" aria-hidden="true"></i></div> </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>

                {/* {laybacklayout()} */}
              </div>
            </div>
          </div>
        </div>

      </div>




      <div className={` mt-2`}>
        {gameData?.map((item, index) => (
          <div key={index} className=" relative">

            <div className="d-flex  justify-content-between p-2  bg-theme text-white" style={{background:"linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)", borderRadius:"4px 4px 0 0"}}><span>{item.title}</span><div>{showMinmax && <span className='bg-dark rounded px-1'>Min/Max: 100 - 100000 </span>} <i onClick={() => setShowMinmax(!showMinmax)} className="fa fa-info-circle" aria-hidden="true"></i></div> 
            </div>
            {/* Body */}
{clsstatus2 && <div style={{    
  left: "35%",
position:"absolute",
    textAlign: "center",
    alignItems: "center",
    display: "flex",
    top: index==0?"23%":index==1?"56%":"88%",
    zIndex: 99999,
    color: "#ca1010",
    opacity:"0.5",
    fontWeight:"700",
    fontSize: "25px"}}>SUSPENDED</div>}
            
            <div
              className="row text-center"
              style={{ background: "linear-gradient(90deg,rgb(153 199 241) 0%,rgb(138 189 216 / 50%) 49%,rgb(146 198 246) 100%)", borderRadius: "0 0 6px 6px" }}
            >

              {/* Player A */}
              <div className="col-6 pb-2">
                <h6 className="fw-bold">{item.playerA}</h6>

                <button
                  className={`btn w-75 ${clsstatus2} `}
                  style={{
                    background: "#6fa8dc",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    fontSize: "12px"
                  }}
                  onClick={() => onBet(true, item)}
                >
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {item.aValue}
                  </div>
                  <div>{item.aAmount}</div>
                </button>
              </div>

              {/* Player B */}
              <div className="col-6 pb-2">
                <h6 className="fw-bold">{item.playerB}</h6>

                <button
                  className={`btn w-75 ${clsstatus2} `}
                  style={{
                    background: "#6fa8dc",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    fontSize: "12px"
                  }}
                  onClick={() => onBet(true, item)}
                >
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {item.bValue}
                  </div>
                  <div>{item.bAmount}</div>
                </button>
              </div>



            </div>
          </div>
        ))}

      </div>


    </div>
  )
}
export default TeenPatti20
