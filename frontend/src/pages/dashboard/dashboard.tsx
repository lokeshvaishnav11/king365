import { AxiosResponse } from "axios";
import React, { useCallback, MouseEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import LMatch from "../../models/LMatch";
import sportsServices from "../../services/sports.service";
import ISport from "../../models/ISport";
import { useAppSelector } from "../../redux/hooks";
import {
  selectSportList,
  setCurrentMatch,
} from "../../redux/actions/sports/sportSlice";
import IMatch from "../../models/IMatch";
import { useDispatch } from "react-redux";
import { CustomLink, useNavigateCustom } from "../_layout/elements/custom-link";
import { useWebsocket } from "../../context/webSocket";
import GameTab from "../_layout/elements/game-tab";
import { isMobile } from "react-device-detect";
import GameTabMobile from "../_layout/elements/game-tab-mobile";
import MatchList from "./elements/match-list";
import MatchListMobile from "./elements/match-list-mobile";
import CasinoListItem from "../CasinoList/CasinoListItem";
import casinoService from "../../services/casino.service";
import betService from "../../services/bet.service";

import providersData from "./providers.json";
import mayfav from "./myfav.json";

import somecasino from "./somecasino.json";

import {
  selectCasinoMatchList,
  setHomePageCasinoMatch,
} from "../../redux/actions/casino/casinoSlice";
import Fav from "../_layout/elements/fav";
import axios from "axios";
import authService from "../../services/auth.service";
import { toast } from "react-toastify";
import Marqueemessge from "../../admin-app/pages/_layout/elements/welcome";

const Dashboard = () => {
  const [matchList, setMatchList] = React.useState<LMatch[]>([]);
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);
  const navigate = useNavigateCustom();
  const dispatch = useDispatch();
  const { socket } = useWebsocket();
  const [odds, setOdds] = React.useState<Record<string, Array<any>>>({});
  const location = useLocation();
  const gamesList = useAppSelector<any>(selectCasinoMatchList);
  const [gameUrl, setGameUrl] = React.useState<string>("");
  const [loadingGame, setLoadingGame] = React.useState(false);

  const isInPlayPage = location.pathname.includes("in-play");

  const onIntcasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: any) => {
    e.preventDefault();

    setLoadingGame(true); // <<-- LOADING START

    const payload: any = {
      lobby_url: Item,
      ipAddress: authService.getIpAddress(),
      isMobile: isMobile,
    };

    casinoService
      .getplaycasinotwo(payload)
      .then((res: AxiosResponse<any>) => {
        setGameUrl(res.data.data.url);
      })
      .finally(() => {
        setLoadingGame(false); // <<-- LOADING STOP
      });
  };
  // const isMobile = true;

  const { sportId, status } = useParams();
  console.log(sportId, status, "from parmas in sports");
  React.useEffect(() => {
    sportsServices
      .getMatchList(sportId, status)
      .then((res: AxiosResponse<any>) => {
        const oddsData = { ...odds };
        console.log(res.data, "data from sport list");
        marketIdsEvent(res.data.data, oddsData, "joinMarketRoom");
        setOdds(oddsData);
        setMatchList(res.data.data);
      });
    return () => {
      const oddsData = { ...odds };
      marketIdsEvent(matchList, oddsData, "leaveMarketRoom");
    };
  }, [sportId, status]);

  React.useEffect(() => {
    if (gamesList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        dispatch(setHomePageCasinoMatch(res.data.data));
      });
  }, []);
  React.useEffect(() => {
    socket.on("getMarketData", (marketData) => {
      let firstIndexFirst = "-";
      let firstIndexTwo = "-";
      let secIndexFirst = "-";
      let secfirstIndexTwo = "-";
      let thirdIndexFirst = "-";
      let thirdfirstIndexTwo = "-";
      if (marketData.runners) {
        if (
          marketData.runners[0] &&
          marketData.runners[0].ex.availableToBack[0]
        ) {
          firstIndexFirst = marketData.runners[0].ex.availableToBack[0].price;
          firstIndexTwo = marketData.runners[0].ex.availableToLay[0].price;
        }

        if (
          marketData.runners[1] &&
          marketData.runners[1].ex.availableToBack[0]
        ) {
          secIndexFirst = marketData.runners[1].ex.availableToBack[0].price;
          secfirstIndexTwo = marketData.runners[1].ex.availableToLay[0].price;
        }

        if (
          marketData.runners[2] &&
          marketData.runners[2].ex.availableToBack[0]
        ) {
          thirdIndexFirst = marketData.runners[2].ex.availableToBack[0].price;
          thirdfirstIndexTwo = marketData.runners[2].ex.availableToLay[0].price;
        }
      }

      setOdds((prevOdds) => ({
        ...prevOdds,
        [marketData.marketId]: [
          firstIndexFirst,
          firstIndexTwo,
          thirdIndexFirst,
          thirdfirstIndexTwo,
          secIndexFirst,
          secfirstIndexTwo,
        ],
      }));
    });

    return () => {
      socket.off("getMarketData");
    };
  }, [odds]);

  // React.useEffect(()=>{
  //   betService.lenadena().then((res:AxiosResponse<any>)  =>{
  //     console.log(res,"res for lena dena jai hind !")
  //   })
  // },[])

  // const fetchMarketData = async () => {
  //   try {
  //      const response = await axios.get("http://185.211.4.99:3000/allMatchUsingSports/4");

  //      console.log(response,"fetching data from api ")
  //     const marketData = response.data;
  //     console.log(marketData,"market Data is")

  //     let firstIndexFirst = "-";
  //     let firstIndexTwo = "-";
  //     let secIndexFirst = "-";
  //     let secfirstIndexTwo = "-";
  //     let thirdIndexFirst = "-";
  //     let thirdfirstIndexTwo = "-";

  //     if (marketData.runners) {
  //       if (marketData.runners[0]?.ex?.availableToBack[0]) {
  //         firstIndexFirst = marketData.runners[0].ex.availableToBack[0].price;
  //         firstIndexTwo = marketData.runners[0].ex.availableToLay[0]?.price || "-";
  //       }

  //       if (marketData.runners[1]?.ex?.availableToBack[0]) {
  //         secIndexFirst = marketData.runners[1].ex.availableToBack[0].price;
  //         secfirstIndexTwo = marketData.runners[1].ex.availableToLay[0]?.price || "-";
  //       }

  //       if (marketData.runners[2]?.ex?.availableToBack[0]) {
  //         thirdIndexFirst = marketData.runners[2].ex.availableToBack[0].price;
  //         thirdfirstIndexTwo = marketData.runners[2].ex.availableToLay[0]?.price || "-";
  //       }
  //     }

  //     setOdds((prevOdds) => ({
  //       ...prevOdds,
  //       [marketData.marketId]: [
  //         firstIndexFirst,
  //         firstIndexTwo,
  //         thirdIndexFirst,
  //         thirdfirstIndexTwo,
  //         secIndexFirst,
  //         secfirstIndexTwo,
  //       ],
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching market data:", error);
  //   }
  // };

  // React.useEffect(() => {
  //   // Fetch data every 2 seconds
  //   const interval = setInterval(() => {
  //     fetchMarketData();
  //   }, 2000);

  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, []);

  const memoOdds = useCallback(
    (marketId: any) => {
      if (!marketId) {
        return (
          <>
            <td>
              <button className="back">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="lay">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="back">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="lay">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="back">
                <span className="odd">-</span>
              </button>
            </td>
            <td>
              <button className="lay">
                <span className="odd">-</span>
              </button>
            </td>
          </>
        );
      }
      const marketData = odds[marketId];
      return (
        <>
          <td>
            <button className="back">
              <span className="odd">
                {(marketData && marketData[0]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="lay">
              <span className="odd">
                {(marketData && marketData[1]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="back">
              <span className="odd">
                {(marketData && marketData[2]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="lay">
              <span className="odd">
                {(marketData && marketData[3]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="back">
              <span className="odd">
                {(marketData && marketData[4]) || "-"}
              </span>
            </button>
          </td>
          <td>
            <button className="lay">
              <span className="odd">
                {(marketData && marketData[5]) || "-"}
              </span>
            </button>
          </td>
        </>
      );
    },
    [odds],
  );

  const menuItems = [
    "Popular",
    "Universe Line",
    "Universe Original",
    "International",
    "Virtual",
  ];

  const marketIdsEvent = (data: any, oddsData: any, event: string) => {
    console.log(data, oddsData, event, "market Event Data");
    data.map((match: IMatch) => {
      match.markets?.map((market) => {
        if (market.marketName == "Match Odds" && !odds[market.marketId]) {
          // setOdds((prevOdds) => ({
          //   ...prevOdds,
          //   [market.marketId]:Array(6).fill('-'),
          // }));
        }
        setTimeout(() => {
          socket.emit(event, market.marketId);
        }, 200);
      });
    });
  };

  const currentMatch = (match: IMatch) => {
    dispatch(setCurrentMatch(match));
    navigate.go(`/odds/${match.matchId}`);
  };

  return (
    <>
      {" "}
      {isMobile ? (
        <GameTabMobile sportId={sportId} sportListState={sportListState} />
      ) : (
        ""
      )}
      {/* <Marqueemessge message={"messages"} /> */}
      <div className="pb-4 ">
        {!isMobile ? <Fav /> : ""}
        {/* {!isMobile ? <GameTab sportId={sportId} sportListState={sportListState} /> : ''} */}

        <div>
          <img
            className="w-100"
            src="https://kingexch365.com/api/users/images/slider-default-2025815182455745.jpg"
          />
        </div>
        <GameTab sportId={sportId} sportListState={sportListState} />



        <ul
          className="d-flexg d-none"
          style={{
            listStyle: "none",
            margin: 0,
            padding: "5px",
            background: "#0b5d4f",
            gap: "5px",
          }}
        >
          {/* ACTIVE TAB */}
          <li>
            <a
              className="nav-link"
              style={{
                background: "#dcdcdc",
                color: "#000",
                padding: "6px 16px",
                borderRadius: "6px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Cricket
            </a>
          </li>

          {/* NORMAL TAB */}
          <li>
            <a
              className="nav-link"
              style={{
                background: "linear-gradient(#2e7d63, #1e5a49)",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Soccer
            </a>
          </li>

          <li>
            <a
              className="nav-link"
              style={{
                background: "linear-gradient(#2e7d63, #1e5a49)",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Tennis
            </a>
          </li>
        </ul>



        <div className="tab-content">
          <div className="tab-pane active">
            <div className="matchlist coupon-card-first">
              {!isMobile ? (
                <MatchList
                  currentMatch={currentMatch}
                  memoOdds={memoOdds}
                  matchList={matchList}
                />
              ) : (
                <MatchListMobile
                  currentMatch={currentMatch}
                  memoOdds={memoOdds}
                  matchList={matchList}
                />
              )}

              <div className="row mx-0 d-none" style={{ marginBottom: "2px" }}>
                <CustomLink
                  to={"/casino-list-int/19"}
                  className={
                    isMobile
                      ? "col-6 position-relative "
                      : "col-3 position-relative"
                  }
                  style={{
                    paddingLeft: "1px",
                    paddingRight: "1px",
                    marginBottom: "2px",
                  }}
                >
                  <img
                    className="img-fluid"
                    src="https://speedcdn.io/frontend_config/diam/images/17627625602470028.gif"
                    alt=""
                  />
                </CustomLink>
                <CustomLink
                  to={"/casino-list-int/20"}
                  className={
                    isMobile
                      ? "col-6 position-relative "
                      : "col-3 position-relative"
                  }
                  style={{ paddingLeft: "1px", paddingRight: "1px" }}
                >
                  <img
                    className="img-fluid"
                    src="https://speedcdn.io/frontend_config/diam/images/17627625664266101.gif"
                    alt=""
                  />
                </CustomLink>
                <CustomLink
                  to={"/casino-list-int/21"}
                  className={
                    isMobile
                      ? "col-6 position-relative "
                      : "col-3 position-relative"
                  }
                  style={{ paddingLeft: "1px", paddingRight: "1px" }}
                >
                  <img
                    className="img-fluid"
                    src="https://speedcdn.io/frontend_config/diam/images/17627625734204431.gif"
                    alt=""
                  />
                </CustomLink>
                <CustomLink
                  to={"/casino-list-int/22"}
                  className={
                    isMobile
                      ? "col-6 position-relative "
                      : "col-3 position-relative"
                  }
                  style={{ paddingLeft: "1px", paddingRight: "1px" }}
                >
                  <img
                    className="img-fluid"
                    src="https://speedcdn.io/frontend_config/diam/images/17650463849494368.gif"
                    alt=""
                  />
                </CustomLink>
              </div>

              <h2
                className="newheading d-none"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "2px",
                  fontSize: "16px",
                  background: "var(--theme2-bg)",
                  padding: "5px 10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  position: "relative",
                  color: "white",
                }}
              >
                <span>Newly Launch</span>
              </h2>
              <div className="row mx-0 mt-0 d-none">
                {mayfav?.map((item: any) => (
                  <div key={item.id} className="col-4 col-md-3 px-1">
                    <a
                      className="csn_thumb mb-2"
                      onClick={(e) => onIntcasinoClick(e, item.id)}
                    >
                      {/* <CustomLink to={`/casino-list-int/${item.id}`}> */}
                      <img
                        className="img-fluid w-100"
                        style={{ height: "15vh" }}
                        src={item.image}
                        alt={item.title}
                      />
                      {/* </CustomLink> */}
                    </a>
                  </div>
                ))}
              </div>
              <h2
                className="newheading"
                style={{
                  display: "none",
                  width: "100%",
                  marginBottom: "2px",
                  fontSize: "16px",
                  background: "var(--theme2-bg)",
                  padding: "5px 10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  position: "relative",
                  color: "white",
                }}
              >
                <span>My Favourites</span>
              </h2>

              <hr style={{ borderTop:"3px solid #265e04",    marginTop: "1px",
    marginBottom: "1px"}} />

              <div
                style={{
                  background: "#0b5d4f",
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                 
                }}
              >
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 18px",
                      color: item == "Popular" ? "white" : "black",
                      fontSize: "14px",
                      fontWeight: item == "Popular" ? "900" : "900",
                      borderRight: "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      background: item === "Vimaan" ? "#08342f" : "transparent",
                      // fontWeight: item === "Vimaan" ? "600" : "400"
                    }}
                  >
                    {item === "Vimaan" ? "✈ " + item : item}
                  </div>
                ))}
              </div>

              <div className="row mx-0" style={{backgroundImage:"url(/imgs/homecasinobg.png)", backgroundSize:"contain", paddingTop:"15px"}}>
                {somecasino?.map((item) => (
                  <div key={item.id} className="col-4 col-md-3 px-1">
                    <div className="csn_thumb mb-2">
                      <CustomLink
                        to={item.gameCode ? `/casino/${item.gameCode}/${item.matchId}` : "#"}
                        onClick={(e) => {
                          if (!item.gameCode) {
                            e.preventDefault();
                            toast.error("Game is coming soon");
                          }
                        }}
                      >
                        <img
                          className="img-fluid w-100"
                          src={item.image}
                          alt={item.title}
                        />
                      </CustomLink>
                    </div>
                  </div>
                ))}
              </div>

              {location.pathname.includes("in-play") || !isMobile ? (
                <div className="home-page d-none">
                  <div
                    className="casino-list mt-2"
                    style={{ marginLeft: !isMobile ? "-6px" : "" }}
                  >
                    {/* <div className='section-title'>Live Casino</div> */}
                    <CasinoListItem />
                  </div>
                </div>
              ) : (
                ""
              )}

              <h2
                className="newheading"
                style={{
                  display: "none",
                  width: "100%",
                  marginBottom: "2px",
                  fontSize: "16px",
                  background: "var(--theme2-bg)",
                  padding: "5px 10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  position: "relative",
                  color: "white",
                }}
              >
                <span>our providers</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      {loadingGame && (
        <div className="fullscreen-loader">
          <div className="loader-card">
            <div className="spinner"></div>
            <div className="loader-text">Loading Casino…</div>
          </div>
        </div>
      )}
      {gameUrl && (
        <div className="slot-iframe show">
          <iframe
            scrolling="no"
            allow="fullscreen;"
            src={gameUrl}
            style={{ width: "100%", border: "0px", height: "100%" }}
          ></iframe>
        </div>
      )}
    </>
  );
};
export default Dashboard;
