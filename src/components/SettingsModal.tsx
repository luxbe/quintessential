import { GameSettings } from '../types'
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
    open={open}
    onClose={onClose}
    title="Settings"
    className="flex flex-col space-y-6"
  >
    <Switch
      label="Timer"
      value={settings?.timer}
      setValue={(v: boolean) =>
        setSettings((s: GameSettings) => ({ ...s, timer: v }))
      }
    />
    <button
      onClick={() => {
        onClose()
        onRandomGame()
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
