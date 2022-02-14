import { useEffect, useState } from 'react'
import { MODAL_DURATION } from '../constants'

export const ToastMessage = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      setTimeout(() => setVisible(false), MODAL_DURATION)
    }
  }, [message])

  return (
    <div
      className={`absolute inset-0 flex justify-center items-center pointer-events-none transition-opacity ${
        visible ? '' : 'opacity-0'
      }`}
    >
      <div className="bg-white text-black px-5 py-2 rounded-full font-bold text-xl shadow-lg">
        {message}
      </div>
    </div>
  )
}
