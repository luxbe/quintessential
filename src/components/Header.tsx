import { t } from 'i18next'
import { HelpIcon, SettingsIcon, StatsIcon } from './Icons'

interface HeaderProps {
  theme?: string
  puzzleNumber?: string | number
  date?: Date
  setModalState: (obj: Record<string, unknown>) => void
}

export const Header = ({
  theme,
  puzzleNumber,
  date,
  setModalState,
}: HeaderProps) => {
  return (
    <>
      <header className="mb-4">
        <div className="w-[3rem]">
          <HelpIcon onClick={() => setModalState({ help: true })} />
        </div>

        <h1>QUINTESSENTIAL</h1>

        <div className="flex space-x-2 w-[3rem]">
          <StatsIcon onClick={() => setModalState({ stats: true })} />
          <SettingsIcon onClick={() => setModalState({ settings: true })} />
        </div>
      </header>
      <div
        className={`flex ${
          theme ? 'justify-between' : 'justify-center'
        } px-2 my-5 max-w-sm mx-auto`}
      >
        <span>
          {puzzleNumber !== 'random' && (
            <span className="font-bold">#{puzzleNumber} </span>
          )}
          <span className="font-light">
            {date?.toISOString().split('T')[0]}
          </span>
        </span>

        {theme && (
          <span>
            <span className="font-bold mr-2">{t('header.theme').toUpperCase()}</span>
            <span className="font-light">{theme?.toUpperCase()}</span>
          </span>
        )}
      </div>
    </>
  )
}
