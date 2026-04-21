// import { useAppSelector } from '../../../redux/hooks'
// import { selectMarketBook } from '../../../redux/actions/bet/betSlice';

// const CasinoPnl = (props: any) => {
//   const { sectionId, matchId, clsName } = props
//   const getMarketBook: any = useAppSelector(selectMarketBook);
//   let xxx = getMarketBook['17760771171832'];
//   console.log( getMarketBook['17760771171832']?.Tiger,xxx?.Tiger,sectionId,matchId,"odds_profit is here")
//   return (
//     <p className={`m-b-0 m-t-5 ${clsName}`}>
//      (
//       <span
//         className={
//           getMarketBook[`${matchId}`]?.{`${sectionId}`}> 0
//             ? `green ${clsName}`
//             : `red`
//         }
//       >
//         {/* {getMarketBook[`${matchId}`][`${sectionId}`].toLocaleString()}ghjkl */}
//       </span>
//     ) : (
//       <span className={clsName} style={{ color: 'black' }}>0</span>
//     )
//   </p>
//   )
// }
// export default CasinoPnl


import { useAppSelector } from '../../../redux/hooks'
import { selectMarketBook } from '../../../redux/actions/bet/betSlice';

// const CasinoPnl = (props: any) => {
//   const { sectionId, matchId, clsName } = props;

//   const getMarketBook: any = useAppSelector(selectMarketBook);

//   // Safe access
//   const pnlValue = getMarketBook?.[matchId]?.[sectionId] ;

//   console.log(
//     getMarketBook?.[matchId]?.Tiger,
//     pnlValue,
//     sectionId,
//     matchId,
//     "odds_profit is here"
//   );

//   return (
//     <>
//    {pnlValue &&( <p className={`m-b-0 m-t-5 ${clsName}`}>
      
//       <span
//         className={
//           pnlValue > 0
//             ? `green ${clsName}`
//             : pnlValue < 0
//             ? `red ${clsName}`
//             : clsName
//         }
//       >
//         { pnlValue > 0 ? "P : " : "L : " } {pnlValue}
//       </span>
      
//     </p>)}

//     </>
//   );
// };

// export default CasinoPnl;


const CasinoPnl = (props: any) => {
  const { sectionId, matchId, clsName } = props;

  const getMarketBook: any = useAppSelector(selectMarketBook);

  const pnlValue = getMarketBook?.[matchId]?.[sectionId];

  if (!pnlValue) return null;

  const isProfit = pnlValue > 0;
  const label = isProfit ? "P : " : "L : ";
  const amount = Math.abs(pnlValue); // ✅ remove minus

  return (
    <p className={`m-b-0 m-t-5 ${clsName}`}>
      <span style={{ color: "black" }}>{label}</span>

      <span
        className={
          isProfit ? "green" : "red"
        }
        style={{ marginLeft: "4px", fontWeight: "600" }}
      >
        {amount}
      </span>
    </p>
  );
};

export default CasinoPnl;
