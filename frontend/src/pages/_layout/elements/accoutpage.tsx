import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectSportList } from "../../../redux/actions/sports/sportSlice";
import { log } from "console";
import mobileSubheader from "./mobile-subheader";
import { CustomLink, useNavigateCustom } from "./custom-link";
import { logout } from "../../../redux/actions/login/loginSlice";

const AccoutPage = () => {
 


    const sportsList = useAppSelector(selectSportList)
    console.log("sportsList", sportsList)

   const accountItems = [
  { name: "Home", link: "/match/in-play" },
  { name: "Account Statement", link: "/accountstatement" },
  { name: "Deposit Statement", link: "/depositstatement" },
  { name: "Withdraw Statement", link: "/withdrawstatement" },
  { name: "Profit Loss Report", link: "/profitloss" },
  { name: "Bet History", link: "/bethistory" },
  { name: "Unsettled Bet", link: "/unsettledbet" },
  { name: "Casino Report History", link: "/casino/result" },
  { name: "Set Button Values", link: "/button-values" },
  { name: "Security Auth Verification", link: "/settings/security-auth" },
  { name: "Change Password", link: "/changepassword" },
  { name: "Rules", link: "/rules" }
];

const dispatch = useAppDispatch();
  const navigate = useNavigateCustom();



 const logoutUser = (e: any) => {

    e.preventDefault();
    dispatch(logout());
    navigate.go("/login");
  };
  return (
    <>
     {mobileSubheader.subheader('Exchange')}
    <div className="bg-light">
      {accountItems?.map((item: any, i: number) => (
         <CustomLink
      key={i}
      to={item.link}
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
        </CustomLink>
      ))}
      <div onClick={logoutUser} className="d-flex justify-content-center align-items-center mb-3  mt-3" style={{gap:"8px"}}><button  className="btn btn-danger w-100 text-white">Logout <i className="fas fa-sign-out-alt"></i> </button></div>
    </div>
    </>
  );
};

export default AccoutPage;