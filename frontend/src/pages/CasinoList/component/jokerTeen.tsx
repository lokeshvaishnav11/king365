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
import LayBackButton from './_common/new/LayBackButton';
import ButtonItem from './_common/new/ButtonItem';
import BackButtonPnl from './_common/new/BackButtonPnl';
import { useParams } from 'react-router-dom'

const  TeenpattiJoker = (props: any) => {
  const { lastOdds, liveMatchData ,defaultNewData } = props

  const liveMatchDataDefault = {
    defaultMarkets: [
      {
        MarketName: "Joker Teen Patti",
        Runners: [
          { RunnerName: "Player A", SelectionId: 1 },
          { RunnerName: "Player B", SelectionId: 2 },
        ]
      }
    ]
  }
   const { gameCode } = useParams()
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch)
  const [updateOdds, setUpdateOdds] = useState<any>(undefined)

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress()
    const oddVal = parseFloat(isBack ? item.b : item.l);
    const odds = oddVal.toString();
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || item.gstatus === 'SUSPENDED') return
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: getCurrentMatch?.match_id || 0,
            selectionName: item?.nation || item?.RunnerName || item?.nat,
            selectionId: item.SelectionId,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: item.mid,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: getCurrentMatch.title,
            betOn: IBetOn.CASINO,
            gtype: gameCode,
          },
        }),
      )
    }
  }
  const laybacklayout = () => {
    const clsnamehead = 'box-4gh text-center'
    return (liveMatchDataDefault?.defaultMarkets?.[0]?.Runners.map((ItemNew: any, key: number) => {
      const ItemMarket: any = lastOdds?.[ItemNew.SelectionId] || {}
    //   const clsstatus = !ItemMarket.gstatus || ItemMarket.gstatus === 'SUSPENDED' || ItemMarket.gstatus === 'CLOSED' ? 'suspended' : ''
          const clsstatus = defaultNewData.status == "dealing" ? "suspended" : '';

      return (
        (
          <tr key={key} className={`${clsstatus} suspendedd `}>
            <td className={clsnamehead} style={{ paddingLeft: "10px" }}>
              <b className='text-center' >{ItemNew.RunnerName}</b>
              {/* <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData?.match_id} /> */}
            </td>
            <LayBackButton selectionid={ItemNew.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} clsnamename={''} defaultNewData={defaultNewData} />
  

          </tr>
        )
      )
    })
    )
  }

    const [showMinmax, setShowMinmax] = React.useState(false);
  
  return (
    <div className='' id={`${getCurrentMatch?.slug}`} style={{ marginTop: "-10px" }}>
            <div className="d-flex justify-content-between p-2 bg-theme text-white rounded" style={{background:"linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)"}} ><span>WINNER</span><div>{showMinmax &&<span className='bg-dark rounded px-1'>Min/Max: 100 - 100000 </span>} <i  onClick={() => setShowMinmax(!showMinmax)} className="fa fa-info-circle" aria-hidden="true"></i></div> </div>

      <div className='row '>
        <div className='col-lg-4 main-market  bg-gray' style={{ padding: '0px' }}>
          <div className='live-poker'>
            <table className='table coupon-table table table-bordered'>
              <thead style={{ borderBottom: "0px" }}>
              </thead>
              <tbody>
                {laybacklayout()}
              </tbody>
              {defaultNewData.status == "dealing" && <div style={{   
                position: "absolute",
    textAlign: "center",
    alignItems: "center",
    top: "1%",
   zIndex: "99",
    color: "rgb(202, 16, 16)",
    opacity: "0.5",
    fontWeight: "700",
    fontSize: "25px",
    background: "#fff",
    width: "100%",
    height: "100%",
    border: "1px solid rgb(202, 16, 16)",
    display: "flex",
    justifyContent: "center", 
    }}><span className='text-center'>SUSPENDED</span></div>}
            </table>
          </div>
        </div>
       
      
      </div>
    </div>
  )
}
export default TeenpattiJoker