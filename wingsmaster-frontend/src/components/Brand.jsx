import logoMark from '../assets/brand/logo-mark.svg'

export function Brand({ compact = false }) {
  return (
    <div className="brand-lockup">
      <img src={logoMark} alt="WingsMaster" className="brand-mark" />
      {!compact && (
        <div>
          <strong>WingsMaster</strong>
          <span>Krunchy Alitas</span>
        </div>
      )}
    </div>
  )
}
