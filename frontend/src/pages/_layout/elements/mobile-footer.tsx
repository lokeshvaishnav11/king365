import { CustomLink } from "./custom-link";

const MobileFooter = () => {
     const menu = [
    { name: "Home", icon: "fas fa-home" , link:"/"},
    { name: "In-Play", icon: "fas fa-stopwatch" , link:"match/4/in-play"},
    { name: "Sports", icon: "fas fa-trophy" , link:"/sports"},
    { name: "Casino", icon: "fas fa-dice" , link:"/casino-games"},
    { name: "Account", icon: "fas fa-user" , link:"/account"},
  ];
  return (
      <>
      {/* 🔽 PAGE CONTENT */}
      <div style={{ paddingBottom: "70px" }}>
        {/* 👆 important: footer ke liye space */}
      </div>

      {/* 🔽 FIXED FOOTER */}
      <div
        className="d-flex justify-content-around align-items-center"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "linear-gradient(180deg, #2c5364, #203a43)",
          height: "65px",
          zIndex: 999,
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        {menu.map((item, i) => (
          <CustomLink 
                to={item.link}
            key={i}
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
              color: "white",
              fontSize: "12px",
              cursor: "pointer",
              flex: 1
            }}
          >
            <i
              className={item.icon}
              style={{ fontSize: "18px", marginBottom: "2px" }}
            ></i>
            <span>{item.name}</span>
          </CustomLink>
        ))}
      </div>
    </>
  );
};
export default MobileFooter;
