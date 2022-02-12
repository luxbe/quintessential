import { useEffect, useState } from 'react'
import { CloseIcon } from './Icons'

export const Modal = ({ open, onClose, title, children, className = '' }) => {
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) setShouldRender(true)
    else setTimeout(() => setShouldRender(false), 250)
  }, [open])

  return (
    <div onClick={onClose} className={`modal ${open ? 'open' : ''}`}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        {shouldRender && (
          <>
            <header>
              <div style={{ width: 25 }} />

              <h1>{title.toUpperCase()}</h1>

              <CloseIcon onClick={onClose} />
            </header>
            <div className={`py-6 px-6 ${className}`}>{children}</div>
          </>
        )}
      </div>
    </div>
  )
}
