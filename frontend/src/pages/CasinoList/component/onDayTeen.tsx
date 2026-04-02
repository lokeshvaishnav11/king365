import CasinoPnl from './casinoPnl';
import LayBackButton from './_common/new/LayBackButton';

const OneDayTeen = (props: any) => {
  const { lastOdds, liveMatchData } = props

  const marketsdef = [
    { RunnerName: "Player A", SelectionId: 1
    },
    { RunnerName: "Player B", SelectionId: 2
    },
  ]

  const laybacklayout = () => {
    const clsnamehead = 'box-6'
    const clsnamename = 'box-2'
    const heightdata = ''
    const markets = liveMatchData?.defaultMarkets?.[0]?.Runners || marketsdef
    return (markets.map((ItemNew: any, key: number) => {
      const Item: any = lastOdds && lastOdds[ItemNew.SelectionId] ? lastOdds[ItemNew.SelectionId] : {}
      const clsstatus =
      !Item.gstatus || Item.gstatus === 'SUSPENDED' || Item.gstatus === 'CLOSED' ? 'suspended' : ''
      return (
        (
          <tr key={key} className={`${clsstatus} ${heightdata}`}>
            <td className={clsnamehead} style={{ paddingLeft: "10px" }}>
              <b>{ItemNew.RunnerName}</b>
              <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} />
            </td>
            <LayBackButton selectionid={ItemNew.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} clsnamename={clsnamename} />
          </tr>
        )
      )
    })
    )
  }
  return (
    <div className='container ' style={{ marginTop: "-10px" }}>      <div className="d-flex justify-content-between p-2 bg-theme text-white rounded"><span>WINNER</span> <i className="fa fa-info-circle" aria-hidden="true"></i> </div>

      <div className='row casino-32A '>
        <div className='col-lg-12 m-b-10 main-market' style={{ padding: '0px' }}>
          <div className='live-poker'>
            <table className='table coupon-table table table-bordered'>
              <thead>
                <tr>
                  <th className={"box-6 text-center"} style={{background:"#bed5d8"}}>Min/Max: 100 - 50000
                  </th>
                  <th className={`back ${"box-2"}`}>BACK</th>
                  <th className={`lay-color ${"box-2"}`}>LAY</th>
                </tr>
              </thead>
              <tbody>
                {laybacklayout()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default OneDayTeen
