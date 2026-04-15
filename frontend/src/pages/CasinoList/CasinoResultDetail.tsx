// /* eslint-disable */
// import React, { Component, useState } from 'react'
// import { Modal, Card } from 'react-bootstrap'
// import casinoService from '../../services/casino.service'


// const CasinoResultDetail = (props: any) => {
//   const { popupdata, setPopStatus, popupstatus } = props
//   const [casinoResult, setCasinoResult] = useState<any>({})
//   const [loader, setLoader] = useState<boolean>(false)

//   console.log(popupdata,"popupdata")

//   // React.useEffect(() => {
//   //   setCasinoResult({})
//   //   setLoader(true)
//   //   if (popupdata.slug && popupdata.slug) {
//   //     casinoService.getResultByMid(popupdata.slug, popupdata.mid).then((res) => {
//   //       setLoader(false)
//   //       setCasinoResult(res?.data?.data)
//   //       if (popupdata.slug === 'Andarbahar' || popupdata.slug === 'Andarbahar2') {
//   //         // @ts-ignore
//   //         globalThis.$('.owl-carousel').owlCarousel({
//   //           rtl: true,
//   //           loop: true,
//   //           margin: 10,
//   //           dots: false,
//   //           responsiveClass: true,
//   //           responsive: {
//   //             0: {
//   //               items: popupdata.slug === 'Andarbahar2' ? 3 : 8,
//   //               nav: true,
//   //             },
//   //             1000: {
//   //               items: 10,
//   //               nav: true,
//   //               loop: false,
//   //             },
//   //           },
//   //         })
//   //       }
//   //     })
//   //   }
//   // }, [props.popupdata])


// const teen20 = () => {
//   const getCard = (key:any) => popupdata?.[key] || "patti_back";

//   const playerA = [getCard("C1"), getCard("C3"), getCard("C5")];
//   const playerB = [getCard("C2"), getCard("C4"), getCard("C6")];

//   const winner = popupdata?.winner; // "A" | "B"

//   return (
//     <div style={{ width: "100%" }}>
      
//       {/* Round ID */}
//       <div style={{ textAlign: "right", fontSize: "12px", color: "#555" }}>
//         RoundId: {popupdata?.roundId}
//       </div>

//       {/* Player A */}
//       <div style={{ textAlign: "center", marginTop: "6px" }}>
//         <div
//           style={{
//             fontSize: "14px",
//             fontWeight: "600",
//             color: "#111",
//           }}
//         >
//           Player A
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "6px",
//             marginTop: "4px",
//           }}
//         >
//           {playerA.map((card, i) => (
//             <img
//               key={i}
//               src={`/imgs/casino/cards/${card}.png`}
//               alt=""
//               style={{ width: "55px", borderRadius: "6px" }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Winner Tag (center) */}
//       {winner && (
//         <div style={{ textAlign: "center", margin: "16px 0" }}>
//           <span
//             style={{
//               background: "#16a34a",
//               color: "#fff",
//               padding: "6px 14px",
//               borderRadius: "8px",
//               fontSize: "13px",
//               fontWeight: "600",
//             }}
//           >
//             Winner
//           </span>
//         </div>
//       )}

//       {/* Player B */}
//       <div style={{ textAlign: "center" }}>
//         <div
//           style={{
//             fontSize: "14px",
//             fontWeight: "600",
//             color: "#111",
//           }}
//         >
//           Player B
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "6px",
//             marginTop: "4px",
//           }}
//         >
//           {playerB.map((card, i) => (
//             <img
//               key={i}
//               src={`/imgs/casino/cards/${card}.png`}
//               alt=""
//               style={{ width: "55px", borderRadius: "6px" }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const dt20 = () => {
//   const dragonCard = popupdata?.C1;
//   const tigerCard = popupdata?.C2;
//   const winner = popupdata?.winner; // "dragon" | "tiger"

//   return (
//     <div
//       style={{
//         // background: "#f3f4f6",
//         // borderRadius: "12px",
//         // padding: "10px",
//         width: "100%",
     
       
//       }}
//     >
//       {/* Round ID */}
//       <div style={{ textAlign: "right", fontSize: "12px", color: "#555" }}>
//         RoundId: {popupdata?.roundId}
//       </div>

//       {/* Cards */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           marginTop: "6px",
//           maxWidth: "260px",
//  margin: "auto",
//         }}
//       >
//         {/* 🐉 Dragon */}
//         <div
//           style={{
//             textAlign: "center",
//             padding: "6px",
//             borderRadius: "10px",
            
            
//             transition: "0.3s",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "13px",
//               fontWeight: "600",
//               color: "#111",
//             }}
//           >
//             Dragon
//           </div>

//           <img
//             alt="dragon"
//             src={`/imgs/casino/cards/${
//               dragonCard ? dragonCard : "patti_back"
//             }.png`}
//             style={{
//               width: "70px",
//               marginTop: "4px",
//               borderRadius: "6px",
//             }}
//           />

//           {/* Winner Tag */}
//           {winner === "dragon" && (
//             <div
//               style={{
//                 marginTop: "4px",
//                 fontSize: "11px",
//                 background: "#059669",
//                 color: "#fff",
//                 fontWeight: "600",
//                 borderRadius: "10px",
//                 padding: "6px",
//               }}
//             >
//               WINNER 
//             </div>
//           )}
//         </div>

//         {/* 🐯 Tiger */}
//         <div
//           style={{
//             textAlign: "center",
//             padding: "6px",
//             borderRadius: "10px",
           
//             transition: "0.3s",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "13px",
//               fontWeight: "600",
//               color: "#111",
//             }}
//           >
//             Tiger
//           </div>

//           <img
//             alt="tiger"
//             src={`/imgs/casino/cards/${
//               tigerCard ? tigerCard : "patti_back"
//             }.png`}
//             style={{
//               width: "70px",
//               marginTop: "4px",
//               borderRadius: "6px",
//             }}
//           />

//           {/* Winner Tag */}
//           {winner === "tiger" && (
//            <div
//               style={{
//                 marginTop: "4px",
//                 fontSize: "11px",
//                 background: "#059669",
//                 color: "#fff",
//                 fontWeight: "600",
//                 borderRadius: "10px",
//                 padding: "6px",
//               }}
//             >
//               WINNER 
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


//  const unlimitedJokerone = () => {
//   const getCard = (key:any) => popupdata?.[key] || "patti_back";

//   const playerA = [getCard("C2"), getCard("C4"), getCard("C6")];
//   const playerB = [getCard("C3"), getCard("C5"), getCard("C7")];
//   const joker = getCard("C1");

//   const winner = popupdata?.winner; // "A" | "B"

//   return (
//     <div style={{ width: "100%" }}>
      
//       {/* Round ID */}
//       <div style={{ textAlign: "right", fontSize: "12px", color: "#555" }}>
//         RoundId: {popupdata?.roundId}
//       </div>

//       {/* Player A */}
//       <div style={{ textAlign: "center", marginTop: "6px" }}>
//         <div style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>
//           Player A
//         </div>

//         <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
//           {playerA.map((card, i) => (
//             <img
//               key={i}
//               src={`/imgs/casino/cards/${card}.png`}
//               alt=""
//               style={{ width: "55px", borderRadius: "6px" }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Winner */}
//       {winner && (
//         <div style={{ textAlign: "center", margin: "16px 0" }}>
//           <span
//             style={{
//               background: "#16a34a",
//               color: "#fff",
//               padding: "6px 14px",
//               borderRadius: "8px",
//               fontSize: "13px",
//               fontWeight: "600",
//             }}
//           >
//             Winner
//           </span>
//         </div>
//       )}

//       {/* Player B */}
//       <div style={{ textAlign: "center" }}>
//         <div style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>
//           Player B
//         </div>

//         <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
//           {playerB.map((card, i) => (
//             <img
//               key={i}
//               src={`/imgs/casino/cards/${card}.png`}
//               alt=""
//               style={{ width: "55px", borderRadius: "6px" }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Joker */}
//       <div style={{ textAlign: "center", marginTop: "10px" }}>
//         <div style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>
//           JOKER
//         </div>

//         <img
//           src={`/imgs/casino/cards/${joker}.png`}
//           alt=""
//           style={{
//             width: "60px",
//             marginTop: "4px",
//             borderRadius: "6px",
//           }}
//         />
//       </div>
//     </div>
//   );
// };



//   return (
//     <Modal
//       show={popupstatus}
//       onHide={() => setPopStatus(false)}
//       size='lg'
//       className='casino-result-modal'
//     >
//       <Modal.Header className='text-white bg'>
//         <div className='bg w-100 d-flex flex-row justify-content-between'>
//           <h4 className='text-white mb-0' style={{ width: '100%' }}>
//             {' '}
//             {popupdata?.event_data?.title || ''}
//             <span style={{ float: 'right' }}>
//               <i
//                 className='fa fa-times text-white'
//                 aria-hidden='true'
//                 onClick={() => setPopStatus(false)}
//                 style={{ cursor: 'pointer', fontSize: '24px' }}
//               />
//             </span>
//           </h4>
//         </div>
//       </Modal.Header>

//       <Modal.Body>
//         {/* <h6 className="text-right round-id">Round Id:  {popupdata?.mid || ''}</h6> */}
//         {loader ? (
//           <div className='text-center'>
//             <i className='mx-5 fas fa-spinner fa-spin'></i>
//           </div>
//         ) : (
//           <>
//           {popupdata?.slug === "teen20" ? teen20() : popupdata?.slug === "dt20" ? dt20() : popupdata?.slug === "joker120" ? unlimitedJokerone() : ""}
//           </>
//         )}
//       </Modal.Body>
//     </Modal>
//   )
// }

// export default React.memo(CasinoResultDetail)



/* eslint-disable */
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

const CasinoResultDetail = (props:any) => {
  const { popupdata, setPopStatus, popupstatus } = props
  const [loader, setLoader] = useState(false)

  //////////////////////////////////////////////////////
  // 🃏 TEEN PATTI
  //////////////////////////////////////////////////////
  const teen20 = () => {
    const getCard = (key:any) => popupdata?.[key] || "patti_back";

    const playerA = [getCard("C1"), getCard("C3"), getCard("C5")];
    const playerB = [getCard("C2"), getCard("C4"), getCard("C6")];

    const winner = popupdata?.winner;

    return (
      <div style={{ width: "100%" }}>
        
        <div style={{ textAlign: "right", fontSize: "12px", color: "#555" }}>
          RoundId: {popupdata?.roundId}
        </div>

        {/* Player A */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Player A
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
            {playerA.map((card, i) => (
              <img key={i} src={`/imgs/casino/cards/${card}.png`} style={{ width: "55px" }} />
            ))}
          </div>

          {winner === "A" && (
            <div style={{
              marginTop: "4px",
              fontSize: "11px",
              background: "#059669",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "4px 8px",
              display: "inline-block"
            }}>
              WINNER
            </div>
          )}
        </div>

        {/* Player B */}
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Player B
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
            {playerB.map((card, i) => (
              <img key={i} src={`/imgs/casino/cards/${card}.png`} style={{ width: "55px" }} />
            ))}
          </div>

          {winner === "B" && (
            <div style={{
              marginTop: "4px",
              fontSize: "11px",
              background: "#059669",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "4px 8px",
              display: "inline-block"
            }}>
              WINNER
            </div>
          )}
        </div>
      </div>
    );
  };

  //////////////////////////////////////////////////////
  // 🐉 DRAGON TIGER (UNCHANGED)
  //////////////////////////////////////////////////////
  const dt20 = () => {
    const dragonCard = popupdata?.C1;
    const tigerCard = popupdata?.C2;
    const winner = popupdata?.winner;

    return (
      <div style={{ width: "100%" }}>
        <div style={{ textAlign: "right", fontSize: "12px", color: "#555" }}>
          RoundId: {popupdata?.roundId}
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "6px", maxWidth: "260px", margin: "auto" }}>

          {/* Dragon */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>Dragon</div>

            <img src={`/imgs/casino/cards/${dragonCard || "patti_back"}.png`} style={{ width: "70px" }} />

            {winner === "dragon" && (
              <div style={{
                marginTop: "4px",
                fontSize: "11px",
                background: "#059669",
                color: "#fff",
                fontWeight: "600",
                borderRadius: "10px",
                padding: "6px"
              }}>
                WINNER
              </div>
            )}
          </div>

          {/* Tiger */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>Tiger</div>

            <img src={`/imgs/casino/cards/${tigerCard || "patti_back"}.png`} style={{ width: "70px" }} />

            {winner === "tiger" && (
              <div style={{
                marginTop: "4px",
                fontSize: "11px",
                background: "#059669",
                color: "#fff",
                fontWeight: "600",
                borderRadius: "10px",
                padding: "6px"
              }}>
                WINNER
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  //////////////////////////////////////////////////////
  // 🃏 JOKER
  //////////////////////////////////////////////////////
  const joker120 = () => {
    const getCard = (key:any) => popupdata?.[key] || "patti_back";

    const playerA = [getCard("C2"), getCard("C4"), getCard("C6")];
    const playerB = [getCard("C3"), getCard("C5"), getCard("C7")];
    const joker = getCard("C1");

    const winner = popupdata?.winner;

    return (
      <div style={{ width: "100%" }}>
        
        <div style={{ textAlign: "right", fontSize: "12px", color: "#555" }}>
          RoundId: {popupdata?.roundId}
        </div>

        {/* Player A */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Player A
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {playerA.map((card, i) => (
              <img key={i} src={`/imgs/casino/cards/${card}.png`} style={{ width: "55px" }} />
            ))}
          </div>

          {winner === "A" && (
            <div style={{
              marginTop: "4px",
              fontSize: "11px",
              background: "#059669",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "4px 8px",
              display: "inline-block"
            }}>
              WINNER
            </div>
          )}
        </div>

        {/* Player B */}
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Player B
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {playerB.map((card, i) => (
              <img key={i} src={`/imgs/casino/cards/${card}.png`} style={{ width: "55px" }} />
            ))}
          </div>

          {winner === "B" && (
            <div style={{
              marginTop: "4px",
              fontSize: "11px",
              background: "#059669",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "4px 8px",
              display: "inline-block"
            }}>
              WINNER
            </div>
          )}
        </div>

        {/* Joker Card */}
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            JOKER
          </div>

          <img src={`/imgs/casino/cards/${joker}.png`} style={{ width: "60px" }} />
        </div>
      </div>
    );
  };

  //////////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////////
  return (
    <Modal
      show={popupstatus}
      onHide={() => setPopStatus(false)}
      size='lg'
      className='casino-result-modal'
    >
      <Modal.Header className='text-white bg'>
        <div className='w-100 d-flex justify-content-between'>
          <h4 className='text-white mb-0'>
            {popupdata?.event_data?.title || ''}
          </h4>
          <i
            className='fa fa-times text-white'
            onClick={() => setPopStatus(false)}
            style={{ cursor: 'pointer', fontSize: '24px' }}
          />
        </div>
      </Modal.Header>

      <Modal.Body>
        {loader ? (
          <div className='text-center'>
            <i className='fas fa-spinner fa-spin'></i>
          </div>
        ) : (
          <>
            {popupdata?.slug === "teen20"
              ? teen20()
              : popupdata?.slug === "dt20"
              ? dt20()
              : popupdata?.slug === "joker120"
              ? joker120()
              : ""}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(CasinoResultDetail)