import { isMobile } from 'react-device-detect'
const subheader = (title: string) => {
  return isMobile ? (
    <div className='game-heading text-center'>
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
