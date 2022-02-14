import { ReactElement, useEffect, useState } from 'react'
import { CloseIcon } from './Icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  id: string
  title: string
  className: string
  children: ReactElement | ReactElement[]
}
export const Modal = ({
  id,
  open,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) => {
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) setShouldRender(true)
    else setTimeout(() => setShouldRender(false), 100)
  }, [open])

  return (
    <div onClick={onClose} className={`modal ${open ? 'open' : ''}`}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        {(open || shouldRender) && (
          <div id={id}>
            <header>
              <div style={{ width: 25 }} />

              <h1>{title.toUpperCase()}</h1>

              <CloseIcon onClick={onClose} />
            </header>
            <div className={`py-6 px-6 ${className}`}>{children}</div>
          </div>
        )}
      </div>
    </div>
  )
}
