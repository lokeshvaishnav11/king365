import React, { Fragment } from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { dateFormat } from "../../../utils/helper";
import { useLocation } from "react-router-dom";

const MatchListMobile = (props: any) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState("In-Play");

  const isInPlayPage = location.pathname.includes("in-play");
  const isHomePage = location.pathname === "/";

  const now = new Date();

  const filteredMatches = props.matchList.filter((match: LMatch) => {
    const matchTime = new Date(match.matchDateTime);

    if (activeTab === "In-Play") {
      return matchTime.getTime() < now.getTime();
    }

    if (activeTab === "Today") {
      return matchTime.toDateString() === now.toDateString();
    }

    if (activeTab === "Tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      return matchTime.toDateString() === tomorrow.toDateString();
    }

    return true;
  });

  console.log("in ply matchess", filteredMatches);

  const groupBySport = (list: LMatch[]) => {
    return {
      cricket: list.filter((m: any) => m.sportId === 4),
      tennis: list.filter((m: any) => m.sportId === 2),
      soccer: list.filter((m: any) => m.sportId === 1),
    };
  };

  const grouped = groupBySport(filteredMatches);

  const renderMatches = (list: LMatch[]) => {
    return list.map((match: LMatch) => (
      <Fragment key={match.matchId}>
        <tr>
          <td colSpan={4}>
            <div className="game-name">
              <a
                onClick={() => props.currentMatch(match)}
                className="text-edark"
                href={undefined}
                style={{
                  color: "#2789ce",
                  fontWeight: "700",
                }}
              >
                {match.name}
              </a>
              <p className="tx-666 tx-12" style={{ marginTop: "3px" }}>
                {new Date(match.matchDateTime).getTime() < new Date().getTime() ? <span className="vimaan-text px-1" style={{fontSize:"10px"}}>In Play</span> : (
                  <i
                    className="fa-regular fa-clock px-1"
                    style={{ color: "#008000" }}
                  /> 
                )}
                {moment(match.matchDateTime).format(dateFormat)}
              </p>
            </div>
          </td>
          <td colSpan={2}>
            <div
              className="game-icons"
              style={{ paddingRight: "0px", gap: "8px" }}
            >
              {/* {new Date(match.matchDateTime).getTime() < new Date().getTime() && (
                      <span className='game-icon'>
                        <i className='fas fa-circle v-m icon-circle tx-green' />
                      </span>
                    )} */}
              {/* <span className='game-icon'>
                      <i className='fas fa-tv v-m icon-tv' />
                    </span> */}
              {match.isFancy && <span className="game-fancy me-1">F</span>}
              {match.isBookMaker && (
                <span className="game-bookmakers me-lg-1">BM</span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
              >
                <path
                  _ngcontent-ng-c261849108=""
                  fill="#7e97a7"
                  d="M12.5 25C5.596 25 0 19.404 0 12.5S5.596 0 12.5 0 25 5.596 25 12.5 19.404 25 12.5 25zm0-1C18.85 24 24 18.85 24 12.5S18.85 1 12.5 1 1 6.15 1 12.5 6.15 24 12.5 24zm5.09-12.078c1.606.516 2.41 1.13 2.41 2.19 0 .373-.067.616-.2.73-.135.115-.403.173-.804.173H13.57l-.81 7.988h-.536l-.795-7.988H6.003c-.4 0-.67-.065-.803-.194-.133-.128-.2-.364-.2-.708 0-1.06.804-1.674 2.41-2.19.09 0 .18-.03.27-.086.49-.172.802-.444.936-.816L9.82 5.95v-.216c0-.23-.222-.415-.668-.558l-.067-.043h-.067c-.536-.143-.804-.387-.804-.73 0-.402.09-.652.268-.753.18-.1.49-.15.938-.15h6.16c.447 0 .76.05.938.15.178.1.268.35.268.752 0 .344-.268.588-.804.73h-.067l-.067.044c-.446.143-.67.33-.67.558v.215l1.206 5.07c.134.372.446.644.937.816.09.057.18.086.27.086z"
                ></path>
              </svg>
              {match.isT10 && (
                <span className="game-icon">
                  <img
                    src="imgs/game-icon.svg"
                    className="bookmaker-icon"
                    style={{ height: "16px" }}
                  />
                </span>
              )}
            </div>
          </td>
        </tr>
        {/* <tr className='min-h-10 '>
                      <td className='ln10' colSpan={6}>
                        &nbsp;
                      </td>
                    </tr> */}
        {/* <tr>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        1
                      </td>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        X
                      </td>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        2
                      </td>
                    </tr> */}
        {/* <tr>{props.memoOdds(marketId)}</tr> */}
        <tr className="min-h-10 border-bottom">
          <td className="ln10" colSpan={6}>
            &nbsp;
          </td>
        </tr>
        <tr className="min-h-10">
          <td className="ln10" colSpan={6}>
            &nbsp;
          </td>
        </tr>
      </Fragment>
    ));
  };

  return (
    <>
      {isHomePage && !isInPlayPage && (
        <div className="container mt-2">
          <div className="d-flex border rounded overflow-hidden">
            {["In-Play", "Today", "Tomorrow"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn flex-fill rounded ${
                  activeTab === tab ? "bg-theme text-white" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}
      <div
        className="card-content mobile-match mt-0"
        style={
          location.pathname.includes("in-play")
            ? { maxHeight: "300px", overflowY: "scroll" }
            : {}
        }
      >
        <table className="table coupon-table coupon-table-mobile">
          <tbody className="d-none">
            {props.matchList.length > 0 ? (
              props.matchList.map((match: LMatch, index: number) => {
                const marketId =
                  match?.markets && match?.markets?.length > 0
                    ? match?.markets[0].marketId
                    : null;
                return (
                  <Fragment key={match.matchId}>
                    <tr>
                      <td colSpan={4}>
                        <div className="game-name">
                          <a
                            onClick={() => props.currentMatch(match)}
                            className="text-edark"
                            href={undefined}
                            style={{
                              color: "#2789ce",
                              fontWeight: "700",
                            }}
                          >
                            {match.name}
                          </a>
                          <p
                            className="tx-666 tx-12"
                            style={{ marginTop: "3px" }}
                          >
                            <i
                              className="fa-regular fa-clock"
                              style={{ color: "#008000" }}
                            />{" "}
                            {moment(match.matchDateTime).format(dateFormat)}
                          </p>
                        </div>
                      </td>
                      <td colSpan={2}>
                        <div
                          className="game-icons"
                          style={{ paddingRight: "0px", gap: "8px" }}
                        >
                          {/* {new Date(match.matchDateTime).getTime() < new Date().getTime() && (
                      <span className='game-icon'>
                        <i className='fas fa-circle v-m icon-circle tx-green' />
                      </span>
                    )} */}
                          {/* <span className='game-icon'>
                      <i className='fas fa-tv v-m icon-tv' />
                    </span> */}
                          {match.isFancy && (
                            <span className="game-fancy me-1">F</span>
                          )}
                          {match.isBookMaker && (
                            <span className="game-bookmakers me-lg-1">BM</span>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                          >
                            <path
                              _ngcontent-ng-c261849108=""
                              fill="#7e97a7"
                              d="M12.5 25C5.596 25 0 19.404 0 12.5S5.596 0 12.5 0 25 5.596 25 12.5 19.404 25 12.5 25zm0-1C18.85 24 24 18.85 24 12.5S18.85 1 12.5 1 1 6.15 1 12.5 6.15 24 12.5 24zm5.09-12.078c1.606.516 2.41 1.13 2.41 2.19 0 .373-.067.616-.2.73-.135.115-.403.173-.804.173H13.57l-.81 7.988h-.536l-.795-7.988H6.003c-.4 0-.67-.065-.803-.194-.133-.128-.2-.364-.2-.708 0-1.06.804-1.674 2.41-2.19.09 0 .18-.03.27-.086.49-.172.802-.444.936-.816L9.82 5.95v-.216c0-.23-.222-.415-.668-.558l-.067-.043h-.067c-.536-.143-.804-.387-.804-.73 0-.402.09-.652.268-.753.18-.1.49-.15.938-.15h6.16c.447 0 .76.05.938.15.178.1.268.35.268.752 0 .344-.268.588-.804.73h-.067l-.067.044c-.446.143-.67.33-.67.558v.215l1.206 5.07c.134.372.446.644.937.816.09.057.18.086.27.086z"
                            ></path>
                          </svg>
                          {match.isT10 && (
                            <span className="game-icon">
                              <img
                                src="imgs/game-icon.svg"
                                className="bookmaker-icon"
                                style={{ height: "16px" }}
                              />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* <tr className='min-h-10 '>
                      <td className='ln10' colSpan={6}>
                        &nbsp;
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        1
                      </td>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        X
                      </td>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        2
                      </td>
                    </tr> */}
                    {/* <tr>{props.memoOdds(marketId)}</tr> */}
                    <tr className="min-h-10 border-bottom">
                      <td className="ln10" colSpan={6}>
                        &nbsp;
                      </td>
                    </tr>
                    <tr className="min-h-10">
                      <td className="ln10" colSpan={6}>
                        &nbsp;
                      </td>
                    </tr>
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td className="text-center bg-gray p10">No Match Found</td>
              </tr>
            )}
          </tbody>
          <tbody>
            {isHomePage && !isInPlayPage ? (
              <>
                {/* Cricket */}
                {grouped.cricket.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={6}>
                        <div
                          style={{
                            background: "var(--theme1-bg)",
                            color: "white",
                            fontSize: "14px",
                            lineHeight: "30px",
                            fontWeight: "700",
                            textAlign: "center",
                            cursor: "pointer",
                            marginBottom:"8px"
                          }}
                        >
                          Cricket
                        </div>
                      </td>
                    </tr>
                    {renderMatches(grouped.cricket)}
                  </>
                )}

                {/* Soccer */}
                {grouped.soccer.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={6}>
                        <div
                          style={{
                            background: "var(--theme1-bg)",
                            color: "white",
                            fontSize: "14px",
                            lineHeight: "30px",
                            fontWeight: "700",
                            textAlign: "center",
                            cursor: "pointer",
                              marginBottom:"8px"
                          }}
                        >
                          Soccer
                        </div>
                      </td>
                    </tr>
                    {renderMatches(grouped.soccer)}
                  </>
                )}

                {/* Tennis */}
                {grouped.tennis.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={6}>
                        <div
                          style={{
                            background: "var(--theme1-bg)",
                            color: "white",
                            fontSize: "14px",
                            lineHeight: "30px",
                            fontWeight: "700",
                            textAlign: "center",
                            cursor: "pointer",
                              marginBottom:"8px"
                          }}
                        >
                          Tennis
                        </div>
                      </td>
                    </tr>
                    {renderMatches(grouped.tennis)}
                  </>
                )}
              </>
            ) : (
              <>
                {props.matchList.length > 0 ? (
                  props.matchList.map((match: LMatch, index: number) => {
                    const marketId =
                      match?.markets && match?.markets?.length > 0
                        ? match?.markets[0].marketId
                        : null;
                    return (
                      <Fragment key={match.matchId}>
                        <tr>
                          <td colSpan={4}>
                            <div className="game-name">
                              <a
                                onClick={() => props.currentMatch(match)}
                                className="text-edark"
                                href={undefined}
                                style={{
                                  color: "#2789ce",
                                  fontWeight: "700",
                                }}
                              >
                                {match.name}
                              </a>
                              <p className="tx-666 tx-12" style={{ marginTop: "3px" }}>
                {new Date(match.matchDateTime).getTime() < new Date().getTime() ? <span className="vimaan-text px-1" style={{fontSize:"10px"}}>In Play</span> : (
                  <i
                    className="fa-regular fa-clock px-1"
                    style={{ color: "#008000" }}
                  /> 
                )}
                {moment(match.matchDateTime).format(dateFormat)}
              </p>
                            </div>
                          </td>
                          <td colSpan={2}>
                            <div
                              className="game-icons"
                              style={{ paddingRight: "0px", gap: "8px" }}
                            >
                              {/* {new Date(match.matchDateTime).getTime() < new Date().getTime() && (
                      <span className='game-icon'>
                        <i className='fas fa-circle v-m icon-circle tx-green' />
                      </span>
                    )} */}
                              {/* <span className='game-icon'>
                      <i className='fas fa-tv v-m icon-tv' />
                    </span> */}
                              {match.isFancy && (
                                <span className="game-fancy me-1">F</span>
                              )}
                              {match.isBookMaker && (
                                <span className="game-bookmakers me-lg-1">
                                  BM
                                </span>
                              )}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                              >
                                <path
                                  _ngcontent-ng-c261849108=""
                                  fill="#7e97a7"
                                  d="M12.5 25C5.596 25 0 19.404 0 12.5S5.596 0 12.5 0 25 5.596 25 12.5 19.404 25 12.5 25zm0-1C18.85 24 24 18.85 24 12.5S18.85 1 12.5 1 1 6.15 1 12.5 6.15 24 12.5 24zm5.09-12.078c1.606.516 2.41 1.13 2.41 2.19 0 .373-.067.616-.2.73-.135.115-.403.173-.804.173H13.57l-.81 7.988h-.536l-.795-7.988H6.003c-.4 0-.67-.065-.803-.194-.133-.128-.2-.364-.2-.708 0-1.06.804-1.674 2.41-2.19.09 0 .18-.03.27-.086.49-.172.802-.444.936-.816L9.82 5.95v-.216c0-.23-.222-.415-.668-.558l-.067-.043h-.067c-.536-.143-.804-.387-.804-.73 0-.402.09-.652.268-.753.18-.1.49-.15.938-.15h6.16c.447 0 .76.05.938.15.178.1.268.35.268.752 0 .344-.268.588-.804.73h-.067l-.067.044c-.446.143-.67.33-.67.558v.215l1.206 5.07c.134.372.446.644.937.816.09.057.18.086.27.086z"
                                ></path>
                              </svg>
                              {match.isT10 && (
                                <span className="game-icon">
                                  <img
                                    src="imgs/game-icon.svg"
                                    className="bookmaker-icon"
                                    style={{ height: "16px" }}
                                  />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {/* <tr className='min-h-10 '>
                      <td className='ln10' colSpan={6}>
                        &nbsp;
                      </td>
                    </tr> */}
                        {/* <tr>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        1
                      </td>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        X
                      </td>
                      <td colSpan={2} className='text-center p5 fw-600 tx-12'>
                        2
                      </td>
                    </tr> */}
                        {/* <tr>{props.memoOdds(marketId)}</tr> */}
                        <tr className="min-h-10 border-bottom">
                          <td className="ln10" colSpan={6}>
                            &nbsp;
                          </td>
                        </tr>
                        <tr className="min-h-10">
                          <td className="ln10" colSpan={6}>
                            &nbsp;
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td className="text-center bg-gray p10">No Match Found</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default React.memo(MatchListMobile);
