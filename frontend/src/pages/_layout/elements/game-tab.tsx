import React from 'react'

const GameTabs = (props: any) => {

  const menuItems = [
    "Vimaan",
    "Cricket",
    "Tennis",
    "Soccer",
    "Horse Racing",
    "Greyhound Racing",
    "Basketball",
    "Lottery",
    "Live Casino",
    "Tips & Previews"
  ];

  // ✅ Icons mapping
  const icons: any = {
     "Vimaan": "fas fa-plane",
    "Cricket": "fas fa-baseball-ball",
    "Tennis": "fas fa-table-tennis",
    "Soccer": "fas fa-futbol",
    "Horse Racing": "fas fa-horse",
    "Greyhound Racing": "fas fa-dog",
    "Basketball": "fas fa-basketball-ball",
    "Lottery": "fas fa-ticket-alt",
    "Live Casino": "fas fa-dice",
    "Tips & Previews": "fas fa-lightbulb"
  };

  return (
    <div className='horizontal-scorller'>
      <div
        style={{
          background: "#0b5d4f",
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap"
        }}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "10px 18px",
              color: "white",
              fontSize: "14px",
              // borderRight: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              background: item === "Vimaan" ? "#000000" : "transparent",
              fontWeight: item === "Vimaan" ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {/* ✅ Icon */}
            <i className={icons[item]}></i>

            {/* Text */}
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(GameTabs)