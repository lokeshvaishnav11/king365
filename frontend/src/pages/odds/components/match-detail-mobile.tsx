/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Fragment } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import MyBetComponent from './my-bet.component'
import moment from 'moment'
import MatchOdds from './match-odds'
import PlaceBetBox from './place-bet-box'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectBetCount } from '../../../redux/actions/bet/betSlice'
import Fancy from './fancy'
import { useWebsocketUser } from '../../../context/webSocketUser'
import TossOdds from './toss-odds'

const MatchDetailWrapper = (props: any) => {
  const dispatch = useAppDispatch()
  const betCount = useAppSelector(selectBetCount)
  const [tavstatus, settvstatus] = React.useState<boolean>(false)
  const { socketUser } = useWebsocketUser()

  // React.useEffect(() => {
  //   return () => {
  //     dispatch(setBetCount(0))
  //   }
  // }, [])

  console.log("match detail wrapper rendered",props.currentMatch)

   const [active, setActive] = React.useState("All");

  const buttons = [
    { label: "All", color: "#000" ,background:"linear-gradient(#A4DC60 0%, #4F9F21 100%)" },
    { label: "Popular", color: "#000" ,background:"linear-gradient(#A4DC60 0%, #4F9F21 100%)" },
    { label: "Match Odds", color: "#000" ,background:"linear-gradient(#A4DC60 0%, #4F9F21 100%)" },
    { label: "Tied Match", color: "#000" ,background:"linear-gradient(#A4DC60 0%, #4F9F21 100%)" },
    { label: "Bookmaker", color: "#000" ,background:"linear-gradient(#A4DC60 0%, #4F9F21 100%)" },
  ];

  const matchName = props.currentMatch?.name || "";

  // "vs" se split (case insensitive handle)


  return (
    <>
      <div className='prelative'>
      
        <div>
          <div>
            {/* <div className='game-heading clsforellipse'>
              <span className='card-header-title giveMeEllipsis'>{props.currentMatch?.name}</span>
              <span className='float-right card-header-date'>
                {moment(props.currentMatch?.matchDateTime).format('MM/DD/YYYY  h:mm a')}
              </span>
            </div> */}

         
             <div className='game-heading clsforellipse text-center'>
              <span className='card-header-title giveMeEllipsis' style={{fontSize:"17px", textTransform:"capitalize", fontWeight:"bolder"}}>{props.currentMatch?.sportId == "4" ? "Cricket" : props.currentMatch?.sportId == "2" ? "Tennis" : props.currentMatch?.sportId == "1" ? "Soccer" : "Sports"}</span>
            </div> 

            <div className="position-relative w-100">

  <img
    src={props.currentMatch?.sportId == "4" ? "/imgs/cricketbg.jpg" : props.currentMatch?.sportId == "2" ? "/imgs/tennisbg.jpg" : props.currentMatch?.sportId == "1" ? "/imgs/soccerbg.jpg" : "/imgs/cricketbg.jpg"}
    className="w-100"
    style={{ display: "block" }}
  />

  {/* TOP ROW */}
  <div
    className="d-flex justify-content-between w-100 px-4"
    style={{
      position: "absolute",
      top: "12px",
      color: "#fff",
      fontWeight: "bold"
    }}
  >
    <span style={{fontSize: "14px",
    fontWeight: "700",
    textShadow: "#FC0 1px 0 10px"}}>OPEN</span>

    <span style={{fontSize: "14px",
    fontWeight: "700",
    textShadow: "#FC0 1px 0 10px"}}>
    Game Time  {props.currentMatch?.matchDateTime
        ? moment(props.currentMatch.matchDateTime).format("MM/DD/YYYY h:mm a")
        : ""}
    </span>
  </div>

  {/* BOTTOM CENTER */}
  <div
    className="w-100 text-center bet-started-anim"
    style={{
      position: "absolute",
      bottom: "5px",
      left: "0",
      color: "#fff",
      fontWeight: "bold"
    }}
  >
   <span style={{fontSize: "14px",
    fontWeight: "700",
    textShadow: "#FC0 1px 0 10px"}}> Bet Started</span>
  </div>

</div>

            {props.scoreBoard()}
            {tavstatus && props.otherTv()}
            {props.t10Tv(250)}

             <div className="d-flex gap-2 flex-nowrap text-nowrap py-2 " style={{overflowX:"auto",gap:"4px",paddingLeft:"3px",background:"linear-gradient(-180deg, #e0e6e6 0%, #e0e6e6 100%)"}}>
      {buttons.map((btn, index) => (
        <div
          key={index}
          onClick={() => setActive(btn.label)}
          style={{
            padding: "10px",
            borderRadius: "21px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize:"13.50px",
            background:
              active === btn.label ? btn.background : "#34495e",
            color: active === btn.label ? btn.color : "#fff",
            border:
              active === btn.label
                ? "1px solid #000"
                : "1px solid transparent",
            transition: "0.3s",
          }}
        >
          {btn.label}
        </div>
      ))}
    </div>


            <div className='markets'>
              {/* Score Component Here */}
              <div className='main-market'>
                {props.markets && <MatchOdds data={props.markets} />}
                {<TossOdds matchName={props.currentMatch?.name} />}
              </div>
            </div>
            <br />
            
            {props.fancies && props.currentMatch && props.currentMatch.sportId == '4' && !String(props?.currentMatch?.matchId).startsWith('1313') && (
              <Fragment>
                {/* @ts-expect-error */}
                {<Fancy socketUser={socketUser} fancies={props.fancies} matchId={props.matchId!} />}
              </Fragment>
            )}
            {props.marketDataList.stake && <PlaceBetBox stake={props.marketDataList.stake} />}
          </div>
          {/* <Tab eventKey='profile' title={`PLACED BET (${betCount})`}>
            <div className='card m-b-10 my-bet'>
              <div className='card-header'>
                <h6 className='card-title d-inline-block'>My Bet</h6>
              </div>
              <div className='card-body'>
                <MyBetComponent />
              </div>
            </div>
          </Tab> */}
        </div>
        <div className='csmobileround' style={{ top: '14px' }}>
          <span onClick={() => settvstatus(tavstatus ? false : true)}>
            <i className='fa fa-tv'></i>{' '}
          </span>
        </div>
      </div>
    </>
  )
}

export default React.memo(MatchDetailWrapper)
