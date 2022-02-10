import { useState } from 'react'
import { getHumanizedTime } from '../utils'
import { CloseIcon } from './Icons'

const Stat = ({ num, label }) => (
  <div className="flex flex-col">
    <span className="text-2xl font-semibold">{num}</span>
    <span className="text-xs mt-1 text-light-gray">{label}</span>
  </div>
)

export const StatsModal = ({
  open,
  onClose,
  isComplete,
  moveCount,
  seconds,
  puzzleNumber,
  stats,
  boardState,
}) => {
  const [showMessage, setShowMessage] = useState(false)
  const puzzleName =
    typeof puzzleNumber === 'number' ? `${puzzleNumber + 1}` : puzzleNumber
  const time = getHumanizedTime(seconds)
  const avgTime = getHumanizedTime(stats.secondCount / (stats.winCount || 1))
  const avgMoves = (stats.moveCount / (stats.winCount || 1)).toFixed(2)
  const shareText = `quintessential.fun #${puzzleName}: ${moveCount} moves in ${time}\n\n${boardState}`
  const onShare = () => {
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 2500)
    navigator.clipboard.writeText(shareText)
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Statistics"
      className="flex flex-col items-center"
    >
      <h2 className="mb-2">All Time</h2>

      <div className="flex space-x-8 mb-6">
        <Stat num={stats.winCount} label="Wins" />
        <Stat num={avgMoves} label="Avg. Moves" />
        <Stat num={avgTime} label="Avg. Time" />
      </div>

      {isComplete && (
        <div>
          <h2 className="mb-2">Last Game</h2>

          <div className="flex space-x-8 mb-6">
            <Stat num={puzzleName} label="Puzzle #" />
            <Stat num={moveCount} label="Moves" />
            <Stat num={time} label="Time" />
          </div>

          <button onClick={onShare}>{showMessage ? 'Copied!' : 'Share'}</button>
        </div>
      )}
    </Modal>
  )
}

export const Modal = ({ open, onClose, title, children, className = '' }) => (
  <div onClick={onClose} className={`modal ${open ? 'open' : ''}`}>
    <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
      <header>
        <div style={{ width: 25 }} />

        <h1>{title.toUpperCase()}</h1>

        <CloseIcon onClick={onClose} />
      </header>
      <div className={`py-6 px-6 ${className}`}>{children}</div>
    </div>
  </div>
)