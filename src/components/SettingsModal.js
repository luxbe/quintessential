import { Modal } from './StatsModal'

export const SettingsModal = ({
  settings,
  setSettings,
  open,
  onClose,
  onNewGame,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Settings"
    className="flex flex-col space-y-6"
  >
    <Switch
      label="Timer"
      value={settings?.timer}
      setValue={(v) => setSettings((s) => ({ ...s, timer: v }))}
    />
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

const Switch = ({ label, value, setValue }) => (
  <div>
    <div className="w-full flex justify-between items-center">
      <span>{label}</span>
      <div className="flex justify-center">
        <div
          className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
            value ? 'bg-green' : 'bg-gray'
          }`}
        >
          <label
            htmlFor="toggle"
            className={`absolute left-0 w-6 h-6 mb-2 transition duration-100 ease-linear transform bg-white border-2 rounded-full cursor-pointer ${
              value
                ? 'translate-x-full border-green'
                : 'translate-x-0 border-gray'
            }`}
          ></label>
          <input
            type="checkbox"
            id="toggle"
            name="toggle"
            className="w-full h-full appearance-none focus:outline-none"
            onClick={() => setValue(!value)}
          />
        </div>
      </div>
    </div>
    <hr className="text-gray w-full mt-4" />
  </div>
)
