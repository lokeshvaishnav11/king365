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
import userService from '../../../services/user.service';
import { IUserBetStake } from '../../../models/IUserStake';
import IMarket from '../../../models/IMarket';
import { useParams } from 'react-router-dom';
import PlaceBetBox from '../../odds/components/place-bet-box';
import PlaceBetBoxCasino from '../../odds/components/place-bet-box-casino';

type MarketData = {
  markets: IMarket[];
  stake: IUserBetStake;
};

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
            marketName: item.SelectioName,
            matchId: 11,
            selectionName: item.SelectioName,
            selectionId: item["sid"],
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b1 : item.l1,
            eventId: defaultNewData.roundId,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: "teen20",
            betOn: IBetOn.CASINO,
            gtype: "teen20",
          },
        }),
      )
    }
  }

  const [marketDataList, setMarketDataList] = React.useState<MarketData>(
      {} as MarketData
    );
  
    const { gameCode } = useParams<{ gameCode?: any }>();
  
  React.useEffect(() => {
    (async () => {
      try {
        const res = await userService.getUserStake();
  
        setMarketDataList({
          markets: [],
          stake: res.data.data.userStake,
        });
      } catch (e: any) {
        const error = e?.response?.data?.message;
        console.log(error);
      }
    })();
  }, [gameCode]);

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
      // playerA: "PLAYER A",
      // playerB: "PLAYER B",
      aValue: 1.98,
      bValue: 1.98,
      aAmount: 1917956,
      bAmount: 2091970,
      playerA:{
      sid: 1,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 2,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "PAIR (DUBBLE) 1:4",
      // playerA: "PLAYER A (PAIR)",
      // playerB: "PLAYER B (PAIR)",
      aValue: 4,
      bValue: 4,
      aAmount: 500000,
      bAmount: 500000,
       playerA:{
      sid: 5,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 6,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "FLUSH (COLOR) 1:8",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 8,
      bValue: 8,
      aAmount: 300000,
      bAmount: 300000,
       playerA:{
      sid: 7,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 8,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "STRAIGHT (ROWN) 1:14",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 14,
      bValue: 14,
      aAmount: 500000,
      bAmount: 500000,
       playerA:{
      sid: 9,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 10,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
 {
      title: "STRAIGHT FLUSH ( PAKKI ROWN ) 1:40",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 40,
      bValue: 40,
      aAmount: 500000,
      bAmount: 500000,
       playerA:{
      sid: 11,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 12,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
     {
      title: "TRIO ( TEEN ) 1:75",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 75,
      bValue: 75,
      aAmount: 1000000,
      bAmount: 1000000,
       playerA:{
      sid: 12,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 13,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "PUTLA (1 PICTURE IN GAME) 1:0.70",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 1.7,
      bValue: 1.7,
      aAmount: 1000000,
      bAmount: 1000000,
       playerA:{
      sid: 13,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 14,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "PUTLA (2 PICTURE IN GAME) 1:4",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 4,
      bValue: 4,
      aAmount: 1000000,
      bAmount: 1000000,
       playerA:{
      sid: 14,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 15,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "PUTLA (3 PICTURE IN GAME) 1:25",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 25,
      bValue: 25,
      aAmount: 500000,
      bAmount: 500000,
       playerA:{
      sid: 15,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 16,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "LOVE MARRIAGE (Q & K WITH SAME SUIT) 1:25",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 25,
      bValue: 25,
      aAmount: 500000,
      bAmount: 500000,
       playerA:{
      sid: 15,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 16,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
    {
      title: "BF LOVE GF (Q & K WITH SAME SUIT) 1:25",
      // playerA: "PLAYER A (FLUSH)",
      // playerB: "PLAYER B (FLUSH)",
      aValue: 25,
      bValue: 25,
      aAmount: 500000,
      bAmount: 500000,
       playerA:{
      sid: 15,
      SelectioName:"Player A",
      aValue: 1.98,

      },
       playerB:{
      sid: 16,
      SelectioName:"Player B",
       bValue: 1.98,

      }
    },
  ];

  const topSizes = ["2%", "11%", "20%", "29%", "38.2%", "47.4%", "56.5%", "65.64%", "74.5%", "83.7%", "92.9%"];

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



     {!clsstatus2 &&  <PlaceBetBoxCasino stake={marketDataList.stake} />}

      <div className={``}>

        {gameData?.map((item, index) => (
          <div key={index} className=" relative" >

            <div className="d-flex  justify-content-between px-2 py-1  bg-theme text-white" style={{background:"linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)", borderRadius:"4px 4px 0 0", fontSize:"12px"}}><strong style={{fontSize:"12px"}}>{item.title}</strong><div>{showMinmax && <span className='bg-dark rounded px-1'>Min/Max: 100 - 100000 </span>} <i onClick={() => setShowMinmax(!showMinmax)} className="fa fa-info-circle" aria-hidden="true"></i></div> 
            </div>
            {/* Body */}
{clsstatus2 && <div style={{   
                position: "absolute",
    textAlign: "center",
    alignItems: "center",
    top: topSizes[index],
    zIndex: "99",
    color: "rgb(202, 16, 16)",
    opacity: "0.5",
    fontWeight: "700",
    fontSize: "25px",
    background: "#fff",
    width: "100%",
    height: "7%",
    border: "1.5px solid rgb(202, 16, 16)",
    display: "flex",
    justifyContent: "center", 
    left:"0px"
    }}><span className='text-center'>SUSPENDED</span></div>}
            
            <div
              className="row text-center"
              style={{ background: "linear-gradient(90deg,rgb(153 199 241) 0%,rgb(138 189 216 / 50%) 49%,rgb(146 198 246) 100%)", borderRadius: "0 0 6px 6px" }}
            >

              {/* Player A */}
              <div className="col-6 pb-2">
                <h6 className="fw-bold" style={{fontSize:"12px",fontWeight:"700",textTransform:"uppercase"}}>{item.playerA.SelectioName}</h6>

                <button
                  className={`btn w-75 ${clsstatus2} `}
                  style={{
                    background: "#6fa8dc",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    fontSize: "12px"
                  }}
                  onClick={() => onBet(true, item.playerA)}
                >
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {item.aValue}
                  </div>
                  <div>{item.aAmount}</div>
                </button>
                <CasinoPnl sectionId={item.playerA.SelectioName} matchId={defaultNewData?.roundId} classData={'text-center'} />

              </div>

              {/* Player B */}
              <div className="col-6 pb-2">
                <h6 className="fw-bold" style={{fontSize:"12px",fontWeight:"700",textTransform:"uppercase"}}>{item.playerB.SelectioName}</h6>

                <button
                  className={`btn w-75 ${clsstatus2} `}
                  style={{
                    background: "#6fa8dc",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    fontSize: "12px"
                  }}
                  onClick={() => onBet(true, item.playerB)}
                >
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {item.bValue}
                  </div>
                  <div>{item.bAmount}</div>
                </button>
                 <CasinoPnl sectionId={item.playerB.SelectioName} matchId={defaultNewData?.roundId} classData={'text-center'} />

              </div>



            </div>
          </div>
        ))}

      </div>


    </div>
  )
}
export default TeenPatti20
