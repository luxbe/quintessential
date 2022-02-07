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

export const StatsModal = ({
  open,
  onClose,
  isComplete,
  moveCount,
  seconds,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Statistics"
    className="flex flex-col items-center"
  >
    {isComplete && (
      <div>
        <p>Moves: {moveCount}</p>
        <p>Time: {seconds} seconds</p>
        <button
          onClick={() => {
            // TODO: copy stats
          }}
        >
          Share
        </button>
      </div>
    )}
  </Modal>
)

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
