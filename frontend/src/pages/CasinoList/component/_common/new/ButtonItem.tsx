import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import axios from "axios";
import { toast } from "react-toastify";

const ButtonItem = (props: any) => {
    const { selectionid, title, lastOdds, liveMatchData ,defaultNewData , odd } = props;
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)

    const onBet = async (isBack = false, item: any) => {
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
                        marketName: title,
                        matchId: 25 ,
                        selectionName: title,
                        selectionId:title === "Dragon" ? 1:title === "Tiger" ? 2 :3,
                        pnl: 0,
                        stack: 0,
                        currentMarketOdds: isBack ? item.b1 : item.l1,
                        eventId: defaultNewData?.roundId,
                        exposure: -0,
                        ipAddress: ipAddress,
                        type: IBetType.Match,
                        matchName: "dt20",
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
                <b style={{textTransform:"uppercase",fontSize:"12px"}}>{title}</b>
            </div>
        </div>
        <button style={{background:"#72bbef",    width: "105px",
    borderRadius: "5px",
    padding: "2px 0",
    boxShadow: "0 2px 7px 1px #67828be6"}} className={`text-uppercase text-black back btn`} onClick={() => onBet(true, ItemMarket)}><span className="d-flex flex-column align-items-center">{odd}<span style={{fontSize:"10px"}}>50000</span></span></button>
    </>
}
export default React.memo(ButtonItem)