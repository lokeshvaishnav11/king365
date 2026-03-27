import { useParams } from "react-router-dom";
import ICasinoMatch from "../../../models/ICasinoMatch";
import ISport from "../../../models/ISport";
import { selectCasinoMatchList } from "../../../redux/actions/casino/casinoSlice";
import { selectSportList } from "../../../redux/actions/sports/sportSlice";
import { useAppSelector } from "../../../redux/hooks";
import { CustomLink, useNavigateCustom } from "./custom-link";
import { MouseEvent } from "react";
import { toast } from "react-toastify";

const SideBar = () => {
  const navigate = useNavigateCustom();
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);
  const { sportId, matchId } = useParams();
  const gamesList = useAppSelector<any>(selectCasinoMatchList);

  const onCasinoClick = (
    e: MouseEvent<HTMLAnchorElement>,
    Item: ICasinoMatch
  ) => {
    e.preventDefault();
    if (!Item.isDisable && Item.match_id != -1)
      navigate.go(`/casino/${Item.slug}/${Item.match_id}`);
    else toast.warn("This game is suspended by admin, please try again later");
  };

  return (
    <>
    <div className="sidebar col-md-2 d-none">
      <div
        style={{ display: "none"  }}
        className="row-deposit-buttons gap-2 w-100"
      >
        <CustomLink className="btn btn-deposit rounded-0 d-flex items-center" to={"/deposit"}>
        <img src="/depositimg.webp" className="w-1 mr-1" />  Deposit
        </CustomLink>
        <CustomLink className="btn btn-withdraw rounded-0 d-flex items-center" to={"/withdraw"}>
        <img src="/withdrawimg.webp" className="w-1 mr-1" /> Withdraw
        </CustomLink>
        
      </div>

      <div
        data-toggle="collapse"
        data-target=".racing"
        className="sidebar-title"
      >
        <h5 className="d-inline-block m-b-0">Racing</h5>
      </div>
      <nav className="collapse racing show">
        <ul>
          {sportListState.sports.map((sport: ISport) => {
            if (sport.sportId != 7 && sport.sportId != 4339) return;
            return (
              <li key={sport._id} className="nav-item">
                <CustomLink
                  to={`/match/${sport.sportId}`}
                  className={`nav-link ${
                    parseInt(sportId || "0") == sport.sportId
                      ? "router-link-active"
                      : ""
                  }`}
                >
                  <span className="new-launch-text">{sport.name}</span>
                </CustomLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        data-toggle="collapse"
        data-target=".casino"
        className="sidebar-title"
      >
        <h5 className="d-inline-block m-b-0">Others</h5>
      </div>
      <nav className="collapse casino show">
        <ul>
          <li className="nav-item">
            <CustomLink to={`/casino-games`} className={`nav-link`}>
              <span className="new-launch-text blink_me">Our Casino</span>
            </CustomLink>
          </li>
          {/* <li className='nav-item'>
            <CustomLink
              to={`/casino-int/virtual-casino`}
              className={`nav-link`}
            >
              <span className='new-launch-text blink_me'>Our Virtual</span>
            </CustomLink>
          </li> */}
          <li className="nav-item">
            <CustomLink to={`/casino-list-int/1`} className={`nav-link`}>
              <span className="new-launch-text ">Live Casino</span>
            </CustomLink>
          </li>
          {/* <li className='nav-item'>
            <CustomLink
              to={`/casino-int/slots`}
              className={`nav-link`}
            >
              <span className='new-launch-text'>Slot Game</span>
            </CustomLink>
          </li> */}
          {/* <li className='nav-item'>
            <CustomLink
              to={`/casino-int/fantasy`}
              className={`nav-link`}
            >
              <span className='new-launch-text'>Fantasy Game</span>
            </CustomLink>
          </li> */}
        </ul>
      </nav>
     <div
  data-toggle="collapse"
  data-target=".sports"
  className="sidebar-title"
  style={{
    background: "linear-gradient(#2c4a7a, #1b2f52)",
    color: "white",
    padding: "8px 10px",
    fontWeight: "600",
    fontSize: "14px"
  }}
>
  <h5 className="m-0 d-flex justify-content-between align-items-center">
    <span>Sports</span>
    <span style={{ fontSize: "18px" }}>⋮</span>
  </h5>
</div>

<nav className="collapse sports show">
  <ul style={{ padding: 0, margin: 0 }}>
    {sportListState.sports
      ?.filter((sport: any) => [4, 1, 2].includes(sport?.sportId))
      ?.map((sport: ISport) => (
        <li key={sport._id} style={{ listStyle: "none" }}>
          
          <CustomLink
            to={`/match/${sport.sportId}`}
            className={`d-flex justify-content-between align-items-center`}
            style={{
              padding: "10px",
              background: "#d3d3d3",
              borderBottom: "1px solid #bcbcbc",
              textDecoration: "none",
              color: "#000",
              fontSize: "14px"
            }}
          >
            {/* LEFT TEXT */}
            <span>{sport.name}</span>

            {/* RIGHT ICON */}
            <span
              style={{
                border: "1px solid #8bc34a",
                borderRadius: "4px",
                padding: "2px 6px",
                color: "#8bc34a",
                fontWeight: "bold",
                fontSize: "12px"
              }}
            >
              ›
            </span>
          </CustomLink>

        </li>
      ))}
  </ul>
</nav>
    </div>

        <div className="sidebar col-md-2" style={{  border: "1px solid #ccc" }}>

      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(#2c4a7a, #1b2f52)",
          color: "#fff",
          padding: "8px 10px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>Sports</span>
        <span style={{ fontSize: "18px" }}>⋮</span>
      </div>

      {/* LIST */}
      <div>

        {[
          "Cricket",
          "Casino",
          "Tennis",
          "Soccer",
          "Horse Racing",
          "Greyhound Racing",
          "Basketball",
          "Lottery"
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              // background: "#d3d3d3",
              borderBottom: "1px solid #bcbcbc",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: "14px" }}>{item}</span>

            {/* RIGHT ICON */}
            <span
              style={{
                border: "1px solid #8bc34a",
                borderRadius: "4px",
                padding: "2px 6px",
                color: "#8bc34a",
                fontWeight: "bold",
                fontSize: "12px"
              }}
            >
              ›
            </span>
          </div>
        ))}

      </div>

    </div>

    </>
  );
};
export default SideBar;
