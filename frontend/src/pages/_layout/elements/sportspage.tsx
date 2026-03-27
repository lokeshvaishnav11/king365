import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectSportList } from "../../../redux/actions/sports/sportSlice";
import { log } from "console";
import mobileSubheader from "./mobile-subheader";
import { CustomLink } from "./custom-link";

const SportsList = () => {
  const items = ["Soccer", "Horse Racing", "Politics"];


    const sportsList = useAppSelector(selectSportList)
    console.log("sportsList", sportsList)

    const quicks = [
  {
    name: "In-Play",
    link: "/inplay",
    icon: "fa-solid fa-play"
  },
  {
    name: "Multi Markets",
    link: "/multimarket",
    icon: "fa-solid fa-layer-group"
  },
  {
    name: "Cricket",
    link: "/match/4",
    icon: "fa-solid fa-baseball-bat-ball"
  },
  {
    name: "Soccer",
    link: "/match/1",
    icon: "fa-solid fa-futbol"
  },
  {
    name: "Tennis",
    link: "/match/2",
    icon: "fa-solid fa-table-tennis-paddle-ball"
  }
];

  return (
    <>
     {mobileSubheader.subheader('Quick Links')}

    <div className="mobile-header mobile-header-2">
  <ul className="nav nav-tabs nav-justified w-100 d-flex">

    {quicks.map((item, index) => (
      <li key={index} className="nav-item text-center" >
        
        <CustomLink to={item.link} className="nav-link" style={{background:"#14213d" , borderRight:"1px solid #ffffff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>

          <i className={`${item.icon}`} style={{ fontSize: "18px" }}></i>

          <p style={{ fontSize: "12px", margin: "0" }}>
            {item.name}
          </p>

        </CustomLink>

      </li>
    ))}

  </ul>
</div>



    {mobileSubheader.subheader('All Sports')}
    <div className="bg-light">
      {sportsList?.sports?.map((item: any, i: number) => (
        <div
          key={i}
          className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
          style={{ cursor: "pointer" }}
        >
          {/* Left Text */}
          <span
            style={{
              color: "#2f80c0",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            {item.name}
          </span>

          {/* Right Arrow Button */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#f8f9fa",
            }}
          >
            <i className="fas fa-chevron-right text-dark"></i>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default SportsList;