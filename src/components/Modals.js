import { useState } from 'react'
import { CloseIcon } from './Icons'

export const HelpModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="Help" className="text-left">
    <p>Try to get all 5 words correct.</p>
    <p>
      <span className="bold text-green">Green</span> means the letter is
      correct.
    </p>
    <p>
      <span className="bold text-yellow">Yellow</span> means it is in that word,
      but not that position in the word.
    </p>
    <p>
      <span className="bold text-light-gray">Gray</span> means the letter is not
      in that word.
    </p>
    <p>Click/tap/drag two letters to swap their position.</p>
  </Modal>
)

export const SettingsModal = ({ open, onClose, onNewGame }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Settings"
    className="flex flex-col items-center"
  >
    <button
      onClick={() => {
        onClose()
        onNewGame()
      }}
    >
      New game
    </button>
  </Modal>
)

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
}) => {
  const [showMessage, setShowMessage] = useState(false)
  const shareText = `Quintessential #${
    puzzleNumber + 1
  }: ${moveCount} Moves in ${seconds} seconds`
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
        <Stat
          num={stats.moveCount / (stats.winCount || 1).toFixed(2)}
          label="Avg. Moves"
        />
        <Stat
          num={stats.secondCount / (stats.winCount || 1).toFixed(2)}
          label="Avg. Time"
        />
      </div>

      {isComplete && (
        <div>
          <h2 className="mb-2">Last Game</h2>

          <div className="flex space-x-8 mb-6">
            <Stat
              num={
                typeof puzzleNumber === 'number'
                  ? puzzleNumber + 1
                  : puzzleNumber
              }
              label="Puzzle #"
            />
            <Stat num={moveCount} label="Moves" />
            <Stat num={seconds} label="Seconds" />
          </div>
          <button
            onClick={() => {
              setShowMessage(true)
              setTimeout(() => setShowMessage(false), 2500)
              navigator.clipboard.writeText(shareText)
            }}
          >
            {showMessage ? 'Copied!' : 'Share'}
          </button>
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
