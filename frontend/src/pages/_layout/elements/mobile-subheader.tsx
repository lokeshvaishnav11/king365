import { isMobile } from 'react-device-detect'
const subheader = (title: string) => {
  return isMobile ? (
    <div className='game-heading text-center' style={{background:"linear-gradient(-180deg,#14805e 0, #184438 100%)"}}>
      <span className='card-header-title'>{title}</span>
    </div>
  ) : (
    ''
  )
}
const subheaderdesktop = (title: string) => {
  return !isMobile ? (
    <div className='card-header text-center'>
      <h4 className='mb-0 '>{title}</h4>
    </div>
  ) : (
    ''
  )
}
export default { subheader, subheaderdesktop }
