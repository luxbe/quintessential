import { GameSettings } from '../types'
import { track } from '../utils'
import { Modal } from './Modal'
import { Switch } from './Switch'

interface SettingsModalProps {
  settings: GameSettings
  open: boolean
  setSettings: (v: any) => {}
  onClose: () => void
  onRandomGame: () => void
}
export const SettingsModal = ({
  settings,
  setSettings,
  open,
  onClose,
  onRandomGame,
}: SettingsModalProps) => (
  <Modal
    id="settings-modal"
    open={open}
    onClose={onClose}
    title="Settings"
    className="flex flex-col space-y-6"
  >
    <Switch
      id="timer-switch"
      label="Timer"
      value={settings?.timer}
      setValue={(v: boolean) => {
        track('event', 'change_setting', { name: 'timer', value: !!v })
        setSettings((s: GameSettings) => ({ ...s, timer: v }))
      }}
    />
    <button
      id="random-button"
      onClick={() => {
        onClose()
        onRandomGame()
      }}
    >
      Random game
    </button>
    <button
      id="clear-stats-button"
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
