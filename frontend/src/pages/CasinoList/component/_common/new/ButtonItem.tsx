import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";

const ButtonItem = (props: any) => {
    const { selectionid, title, lastOdds, liveMatchData ,defaultNewData , odd } = props;
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)

    const onBet = (isBack = false, item: any) => {
        console.log("sdfgsdf", item);
        const ipAddress = authService.getIpAddress()
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b1 : item.l1);
            if (oddsVal <= 0) return
            if (!defaultNewData.status || defaultNewData.status == 'result' || defaultNewData.status=='0') return
            dispatch(
                betPopup({
                    isOpen: true,
                    betData: {
                        isBack,
                        odds: odd,
                        volume: isBack ? item.bs1 : item.ls1,
                        marketId: defaultNewData?.roundId,
                        marketName: "Dragon Tiger",
                        matchId: defaultNewData?.roundId ,
                        selectionName: title,
                        selectionId: selectionid,
                        pnl: 0,
                        stack: 0,
                        currentMarketOdds: isBack ? item.b1 : item.l1,
                        eventId: defaultNewData?.roundId,
                        exposure: -0,
                        ipAddress: ipAddress,
                        type: IBetType.Match,
                        matchName: "Dragon Tiger",
                        betOn: IBetOn.CASINO,
                        gtype: "dt20",
                    },
                }),
            )
        }
    }
    
    const ItemMarket: any = odd || {}
    // const suspend = !ItemMarket.gstatus || ItemMarket.gstatus == 0 || ItemMarket.gstatus == "SUSPENDED" || ItemMarket.gstatus == "CLOSED" ? 'suspended' : '';
    const suspend = defaultNewData.status == "result" ? "suspended" : '';
    return <>
        <div className='row m-b-10'>
            <div className='col-12 text-center'>
                <b>{title}</b>
            </div>
        </div>
        <button className={`text-uppercase btn-theme ${suspend}`} onClick={() => onBet(true, ItemMarket)}><b >{odd}</b></button>
    </>
}
export default React.memo(ButtonItem)