// import React from 'react'

// const GameTabs = (props: any) => {

//   const menuItems = [
//     "Vimaan",
//     "Cricket",
//     "Tennis",
//     "Soccer",
//     "Horse Racing",
//     "Greyhound Racing",
//     "Basketball",
//     "Lottery",
//     "Live Casino",
//     "Tips & Previews"
//   ];

//   // ✅ Icons mapping
//   const icons: any = {
//      "Vimaan": "fas fa-plane",
//     "Cricket": "fas fa-baseball-ball",
//     "Tennis": "fas fa-table-tennis",
//     "Soccer": "fas fa-futbol",
//     "Horse Racing": "fas fa-horse",
//     "Greyhound Racing": "fas fa-dog",
//     "Basketball": "fas fa-basketball-ball",
//     "Lottery": "fas fa-ticket-alt",
//     "Live Casino": "fas fa-dice",
//     "Tips & Previews": "fas fa-lightbulb"
//   };

//   return (
//     <div className='horizontal-scorller'>
//       <div
//         style={{
//           background: "#0b5d4f",
//           display: "flex",
//           overflowX: "auto",
//           whiteSpace: "nowrap"
//         }}
//       >
//         {menuItems.map((item, index) => (
//           <div
//             key={index}
//             style={{
//               padding: "10px 18px",
//               color: "white",
//               fontSize: "14px",
//               // borderRight: "1px solid rgba(255,255,255,0.2)",
//               cursor: "pointer",
//               background: item === "Vimaan" ? "#000000" : "transparent",
//               fontWeight: item === "Vimaan" ? "600" : "400",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px"
//             }}
//           >
//             {/* ✅ Icon */}
//             <i className={icons[item]}></i>

//             {/* Text */}
//             {item}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default React.memo(GameTabs)


import React from 'react'
import './header.css' // 👈 CSS alag file me daalo
import { link } from 'fs';
import { CustomLink } from './custom-link';

const GameTabs = (props: any) => {

    const [showSearch, setShowSearch] = React.useState(false)

  const menuItems = [
   {title: "Vimaan", link:"/casino-list-int/6"},
  { title: "Cricket", link:"/match/4/in-play" },
    {title: "Tennis", link:"/match/2/in-play"},
    {title: "Soccer", link:"/match/1/in-play"},
    {title: "Live Casino", link:"/casino-games"},
    {title: "Tips & Previews", link:"#"}
  ];

  const icons: any = {
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
    <div style={{ display: "flex", alignItems: "center", background: "#0b5d4f" }}>

      {/* LEFT SIDE - SCROLL MENU */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          flex: 1
        }}
      >

        {menuItems.map((item, index) => (
          <CustomLink to={item.link}
            key={index}
            className={item.title === "Vimaan" ? "vimaan-item" : ""}
            style={{
              padding: "10px 18px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "black",
              fontWeight:"700"
            }}
          >
            {/* ✅ Vimaan me image */}
            {item.title === "Vimaan" ? (
              <img
                src="/imgs/viman.png" // 👈 apni image path daalo
                alt="vimaan"
                style={{ width: "18px", height: "18px" }}
                className='vimaan-text'
              />
            ) : (
              <i className={icons[item.title]}></i>
            )}

             {/* 🔍 Search Input */}
       

            <span className={item.title === "Vimaan" ? "vimaan-text" : ""}>
              {item.title}
            </span>
          </CustomLink>
        ))}
      </div>

       {showSearch && (
          <input
            type="text"
            placeholder="Search games..."
            className="search-input"
          />
        )}

      {/* RIGHT SIDE - SEARCH ICON */}
      <div  onClick={() => setShowSearch(!showSearch)} style={{ padding: "0 15px", color: "white", cursor: "pointer" }}>
        <i className="fas fa-search"></i>
      </div>

    </div>
  )
}

export default React.memo(GameTabs)