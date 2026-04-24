import React from 'react'
// import { isMobile } from 'react-device-detect'
// import AutoCompleteComponent from '../../../../components/AutocompleteComponent'
import IMatch from '../../../../models/IMatch'
import matchService from '../../../../services/match.service'
const Marqueemessge = (props: any) => {
  const [showAuto, setShowAuto] = React.useState<boolean>(false)

  const suggestion = ({ value }: any) => {
    return matchService.getMatchListSuggestion({ name: value })
  }

  const onMatchClick = (match: IMatch | null) => {
    if (match) {
      window.location.href = `/odds/${match.matchId}`
    }
  }
  return (
    <div className='marqueeheader' style={{background:"linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)",padding:"0px"}}>
      {/* {isMobile ? (
        <span className='search float-left'>
          <a
            href='#'
            className='search-input'
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              setShowAuto(!showAuto)
            }}
          >
            <i className='fas fa-search-plus' style={{ fontSize: '24px' }} />
          </a>

          <AutoCompleteComponent<IMatch>
            className={`search-input-show col-md-10 ${showAuto ? 'show' : ''}`}
            label={'Search'}
            optionKey={'name'}
            api={suggestion}
            onClick={onMatchClick}
          />
        </span>
      ) : (
        ''
      )} */}
     <div style={{background:"linear-gradient(-180deg, #274253 0%, #0f191f 82%)",padding:"4px 4px 0px 9px"}}> <h4 style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"12px",fontWeight:"700",color:"white",marginBottom:"4px"}}><i className="fa fa-microphone"></i> News </h4></div>
      <div className='marqueeN' style={{ color: "#fff",fontSize:"12px",fontWeight:"700", padding:"0px" }}>
        <p>{props.message}</p>
      </div>
    </div>
  )
}
export default Marqueemessge
