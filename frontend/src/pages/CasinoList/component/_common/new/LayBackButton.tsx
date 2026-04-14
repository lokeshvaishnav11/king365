import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { nFormatter } from "../../../../../utils/helper";

const LayButton = (props: any) => {
    const { selectionid, lastOdds, liveMatchData, clsnamename , defaultNewData,ItemNew } = props;
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)
    const onBet = (isBack = false, item: any) => {
      console.log(item,"chdckek")
        const ipAddress = authService.getIpAddress()
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b1 : item.l1);
            if (oddsVal <= 0) return
            if (!defaultNewData.status || defaultNewData.status == 'dealing') return
            dispatch(
                betPopup({
                    isOpen: true,
                    betData: {
                        isBack,
                        odds: 1.98,
                        volume: isBack ? (item.bs1>1000000 ? 1 : item.bs1) : (item.ls1>1000000 ? 1 : item.ls1),
                        marketId: defaultNewData?.roundId,
                        marketName: "Bookmaker",
                        matchId:  84,
                        selectionName: ItemNew.RunnerName,
                        selectionId: ItemNew.SelectionId,
                        pnl: 0,
                        stack: 0,
                        currentMarketOdds: isBack ? item.b1 : item.l1,
                        eventId: defaultNewData.roundId,
                        exposure: -0,
                        ipAddress: ipAddress,
                        type: IBetType.Match,
                        matchName: "joker120",
                        betOn: IBetOn.CASINO,
                        gtype: "joker120",
                    },
                }),
            )
        }
    }
    const ItemMarket: any = "1.98" 
    return <>
     <td className={`back teen-section box-3 text-center ${clsnamename}`}>
              <button style={{border:"none", textAlign:"center"}} className='back' onClick={() => onBet(true, ItemNew)}>
                <span className='odd'>{"1.98"}</span>{' '}
                {/* <span className='fw-12 laysize' style={{display:"block"}}>{nFormatter(ItemMarket.bs1, 2)}</span> */}
              </button>
            </td>
            {/* <td className={`lay teen-section ${clsnamename}`}>
              <button className='lay' onClick={() => onBet(false, ItemMarket)}>
                <span className='odd'>
                  <b>{ItemMarket.l1}</b>
                </span>
                <span className='fw-12 laysize' style={{display:"block"}}>{nFormatter(ItemMarket.ls1, 2)}</span>
              </button>
            </td> */}
    </>
}
export default React.memo(LayButton)