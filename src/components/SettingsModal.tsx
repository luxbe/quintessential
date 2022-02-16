import { GameSettings } from '../types'
import { track } from '../utils'
import { Modal } from './Modal'
import { Switch } from './Switch'
import { Dropdown } from './Dropdown'
import { LANGUAGES } from '../constants'
import { t } from 'i18next'
import i18n from '../i18n'

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
}: SettingsModalProps) => (<Modal
  id="settings-modal"
  open={open}
  onClose={onClose}
  title={t("settings.title")}
  className="flex flex-col space-y-6"
>
  <Switch
    id="timer-switch"
    label={t("settings.timer")}
    value={settings?.timer}
    setValue={(v: boolean) => {
      track('event', 'change_setting', { name: 'timer', value: !!v })
      setSettings((s: GameSettings) => ({ ...s, timer: v }))
    }}
  />
  <Dropdown
    id="language-switch"
    label={t("settings.language")}
    value={settings?.language}
    options={Object.keys(LANGUAGES).map(key => [LANGUAGES[key as keyof typeof LANGUAGES].nativeName, key])}
    setValue={(v: string) => {
      track('event', 'change_setting', { name: 'timer', value: !!v })
      setSettings((s: GameSettings) => ({ ...s, language: v }))
      i18n.changeLanguage(v)
    }}
  />
  <button
    id="random-button"
    onClick={() => {
      onClose()
      onRandomGame()
    }}
  >
    {t("settings.randomGame")}
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
    {t("settings.clearStats")}
  </button>
</Modal>
)