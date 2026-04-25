import moment from "moment";
import React from "react";
import { useWebsocketUser } from "../../../context/webSocketUser";
import IBet from "../../../models/IBet";
import { RoleType } from "../../../models/User";
import {
  selectPlaceBet,
  setBetCount,
  setbetlist,
  setBookMarketList,
} from "../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { betDateFormat } from "../../../utils/helper";
import { isMobile } from "react-device-detect";
import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import accountService from "../../../services/account.service";
import betService from "../../../services/bet.service";

const MyBetComponent22 = (props: any) => {
  const [getMyAllBet, setMyAllBet] = React.useState<IBet[]>([]);

  

  const getPlaceBet = useAppSelector(selectPlaceBet);
  const getCurrentMatch = useAppSelector(selectCurrentMatch);
  const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();
  const dispatch = useAppDispatch();
  const [betRefresh, setRefreshStatus] = React.useState<any>(false);
  const location = useLocation();
  const { matchId } = useParams();
  const [showCelebration, setShowCelebration] = React.useState(false);
  const lastCelebratedRound = React.useRef<number | null>(null);
  React.useEffect(() => {
    // console.log(getCurrentMatch,"hello world here is Match id")
    console.log(
      getCasinoCurrentMatch?.match_id,
      " getCasinoCurrentMatch hello world here is Match id",
    );

    {
      const dataMatchId: any = matchId;
      console.log("hello world match");
      betService
        .getBets(dataMatchId)
        .then((bets) => {
          console.log(bets.data, "chech bet dataggfgf");
          bets &&
            bets.data &&
            bets.data.data &&
            setMyAllBet(bets.data.data.bets);
          // dispatch(setbetlist(bets.data.data.bets))
          dispatch(setBookMarketList(bets.data.data.odds_profit))
          // dispatch(setBetCount(bets.data.data.bets.length))
        })
        .catch((e) => {
          console.log(e.stack);
        });
    }
  }, [getCurrentMatch, getCasinoCurrentMatch, betRefresh]);

  React.useEffect(() => {
    if (getPlaceBet.bet.marketId) {
      //setMyAllBet([{ ...getPlaceBet.bet }, ...getMyAllBet])
      setRefreshStatus(betRefresh ? false : true);
    }
  }, [getPlaceBet.bet]);

  React.useEffect(() => {
    socketUser.on("placedBet", (bet: IBet) => {
      ///setMyAllBet([bet, ...getMyAllBet])
      setRefreshStatus(betRefresh ? false : true);
    });
    return () => {
      socketUser.off("placedBet");
    };
  }, [getMyAllBet]);

  React.useEffect(() => {
    socketUser.on("betDelete", ({ betId }) => {
      ///setMyAllBet(getMyAllBet.filter((bet: IBet) => bet._id !== betId))
      setRefreshStatus(betRefresh ? false : true);
      ///dispatch(setBookMarketList({}))
    });
    return () => {
      socketUser.off("betDelete");
    };
  }, [getMyAllBet]);

  console.log(props,getMyAllBet,"sdfgdf")

  React.useEffect(() => {
    // const interval = setInterval(() => {

      const currentRoundId = props?.data?.roundId;
        const winner = props?.data?.winner?.trim().toLowerCase();

        // console.log(currentRoundId,winner,"rahuadlgfdfg")


      if (!currentRoundId || !winner || !getMyAllBet.length) return;

        // 🚫 sirf result pe run kare
  if (props?.data?.status !== "result") return;

      // Already celebrate ho chuka hai toh skip
      if (lastCelebratedRound.current === currentRoundId) return;

      // 🔍 find bet of this round
      const roundBet = getMyAllBet.find(
        (bet: any) => bet?.marketId == currentRoundId,
        //yhn matchid se nhi kr skte gametype se kr skte hai like gamecode se if need
      );

      if (!roundBet) return;

        // const selection = roundBet.selectionName?.trim().toLowerCase(); old wala jisme exact winner = slectionName
        const rawSelection = roundBet.selectionName?.trim().toLowerCase();

// convert "player a" -> "a"
let selection = rawSelection;

if (rawSelection?.includes("player")) {
  selection = rawSelection.replace("player", "").trim(); // "a"
}


      console.log(roundBet?.selectionName,selection, "roundsdfvbet" , props?.data?.winner);

      if (selection === winner) {
    lastCelebratedRound.current = currentRoundId;

    setShowCelebration(true);

    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  }


  
  }, [getMyAllBet, props?.data]);

  const navigate = useNavigate();

  // totals calculate karne ke liye reduce
  const totals = React.useMemo(() => {
    let plus = 0;
    let minus = 0;

    getMyAllBet.forEach((bet) => {
      //@ts-ignore
      const val = Number(bet?.profitLoss?.$numberDecimal) || 0;
      if (val >= 0) {
        plus += val;
      } else {
        minus += val; // ye negative hoga
      }
    });

    return {
      plus: plus.toFixed(2),
      minus: minus.toFixed(2),
    };
  }, [getMyAllBet]);

  return (
    <>
      <div
        className="d-flelx justify-content-between d-none"
        style={{ fontSize: "13px" }}
      >
        <div>
          <span className="text-success">+{totals.plus}</span>
        </div>
        <div>
          <span className="text-danger">{totals.minus}</span>
        </div>
      </div>

      <div
        className="text-center text-white py-2 d-none"
        style={{ marginTop: "25px", background: "#0f2326" }}
      >
        <div style={{ fontSize: "13px", color: "white" }}>COMPLETED BETS</div>
      </div>

      <div
        className="table-responsive-new d-none"
        style={{ height: "", overflowY: "scroll" }}
      >
        <table className="table coupon-table scorall mybet table-bordered">
          <thead>
            <tr style={{ background: "#76d68f" }}>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                #
              </th>
              {userState.user.role !== RoleType.user && (
                <th
                  className="text-center px-2 py-2"
                  style={{
                    background: "#0f2326",
                    border: "none",
                    color: "white",
                  }}
                >
                  Username
                </th>
              )}
              <th
                style={{ background: "#0f2326", color: "white" }}
                className="text-center px-1 py-2"
              >
                {" "}
                Runner Name
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Type
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Bet Mode
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Price
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Value
              </th>
              <th
                className="text-center px-1 py-2"
                style={{ background: "#0f2326", border: "", color: "white" }}
              >
                {" "}
                Amount
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                {" "}
                Result
              </th>
              <th
                style={{ background: "#0f2326", border: "", color: "white" }}
                className="text-center px-1 py-2"
              >
                Status
              </th>

              {/* {userState.user.role !== RoleType.user && <th style={{background:"#0f2326" , border:"" , color:"white"}}> Status</th>} */}
            </tr>
          </thead>
          <tbody className="scorall">
            {getMyAllBet.map((bet: any, index: number) => (
              <tr
                style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                key={bet._id}
              >
                <td
                  className="no-wrap p-2 "
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {" "}
                  {index + 1}{" "}
                </td>
                {userState.user.role !== RoleType.user && (
                  <td
                    className="p-1"
                    style={{
                      background: bet.isBack ? "#72BBEF" : "#faa9ba",
                      fontSize: "12px",
                    }}
                  >
                    {bet.userName}({bet?.code})
                  </td>
                )}
                <td
                  className="no-wrap text-center p-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {bet.selectionName}
                  {/* {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.volume.toFixed(2)
                    : bet.odds}{" "} */}
                </td>
                <td
                  className="no-wrap text-center p-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {bet?.bet_on}
                </td>
                <td
                  className="no-wrap text-center"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {bet.isBack ? "Yes" : "No"}{" "}
                </td>

                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.volume.toFixed(2)
                    : bet.odds}
                </td>
                {/* <td className='no-wrap'>{Math.abs(bet?.profitLoss?.$numberDecimal).toFixed(2)}</td> */}

                <td
                  className="no-wrap text-center px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {bet.marketName === "Fancy" && bet.gtype !== "fancy1"
                    ? bet.odds
                    : bet.selectionName}{" "}
                </td>
                <td
                  className="no-wrap px-2"
                  style={{ background: bet.isBack ? "#72BBEF" : "#faa9ba" }}
                >
                  {Math.abs(Number(bet?.profitLoss?.$numberDecimal)).toFixed(2)}
                </td>

                {/* <td className='no-wrap text-center' > {bet.isBack ? "Yes" : "No"} </td> */}

                {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.betClickTime).format(betDateFormat)} </td>
              )} */}
                {/* {!isMobile && (
                <td className='no-wrap'> {moment(bet.createdAt).format(betDateFormat)} </td>
              )} */}

                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "15px",
                  }}
                >
                  {bet.bet_on === "MATCH_ODDS"
                    ? (() => {
                        const market = bet?.result?.[0]; // pehla market object
                        if (market && market.result) {
                          // result value hai -> runnerName find karna
                          const runner = market.runners?.find(
                            (r: any) => r.selectionId === Number(market.result),
                          );
                          return runner ? runner.runnerName : market.result;
                        } else {
                          return "YES"; // agar result hi nahi hai
                        }
                      })()
                    : bet?.result?.result
                    ? bet.result?.result
                    : "YES"}
                </td>
                <td
                  className="no-wrap text-center px-2"
                  style={{
                    background: bet.isBack ? "#72BBEF" : "#faa9ba",
                    fontSize: "15px",
                  }}
                >
                  {" "}
                  {bet.status}{" "}
                </td>

                {/* {userState.user.role !== RoleType.user && <td className='no-wrap'>{moment.utc(bet.betClickTime).utcOffset('+05:30').format('DD/MM/YYYY hh:mm:ss A')}</td>} */}
              </tr>
            ))}

            <tr
              className=""
              style={{ fontWeight: "bold", background: "#f0f0f0" }}
            >
              <td
                colSpan={userState.user.role !== RoleType.user ? 4 : 3}
                className="text-center p-2"
              >
                Total Plus Minus
              </td>
              <td
                className="text-center"
                style={{
                  color:
                    Number(totals.plus) + Number(totals.minus) >= 0
                      ? "green"
                      : "red",
                }}
              >
                {Number(totals.plus) + Number(totals.minus)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {showCelebration && (
        <div className="celebration-overlay">
          <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3B5ZWkyYTVnN2VoajZ4bDdvM2JrYWQxdWQ5bDBsMThxbmtob3V2ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9u2VQAwIgpMZKT6qTV/giphy.gif" alt="celebrate" />
          Celebration succsess 
        </div>
      )}
    </>
  );
};

export default MyBetComponent22;
