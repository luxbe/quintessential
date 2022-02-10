import { Modal } from './StatsModal'

export const SettingsModal = ({ open, onClose, onNewGame }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Settings"
    className="flex flex-col items-center space-y-4"
  >
    <button
      onClick={() => {
        onClose()
        onNewGame()
      }}
    >
      Random game
    </button>
    <button
      onClick={() => {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('quintessential'))
          .forEach((k) => localStorage.removeItem(k))
        window.location.reload()
      }}
    >
      Clear Stats
    </button>
  </Modal>
)
