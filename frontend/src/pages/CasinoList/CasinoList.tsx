import React from 'react'
import { isMobile } from 'react-device-detect'
import CasinoListItem from './CasinoListItem'

import providersData from './providers.json'; 
import { CustomLink } from '../_layout/elements/custom-link';

import somecasino from "../dashboard/somecasino.json"
import { toast } from 'react-toastify';

const CasinoList = () => {
  const casinoWidth = isMobile ? 'col-3' : 'col-2'

  const menuItems = [
    "Popular",
    "Universe Line",
    "Universe Original",
    "International",
    "Virtual",
  ];

  return (
    <>
      {/* <div className='game-heading'>
        <span className='card-header-title'>Casino Games</span>
      </div> */}


      {/* <div style={{overflowX:"scroll"}} className="rows d-flex mx-0 mt-0">
  {providersData?.map((item) => (
    <div
      key={item.id}
      className="col-4 col-md-3 px-1"
    >
      <div className="csn_thumb mb-2 mt-2">
        <CustomLink className='nav-link' style={{background:"var(--theme2-bg)" , color:"white"}} to={`/casino-list-int/${item.id}`}>
          <span>
           {item.title}
            </span>
        </CustomLink>
      </div>
    </div>
  ))}
</div> */}

      

      

      {/* <div className='col-12'>
        <div className='card-content home-page casino-list pt30 pb30'>
          <CasinoListItem />
        </div>
      </div> */}



{/* from dashboard data to list upar wala hai normal mac ya standard exchange list  */}


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




    </>
  )
}
export default React.memo(CasinoList)
