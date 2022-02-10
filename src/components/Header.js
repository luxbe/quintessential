import { HelpIcon, SettingsIcon, StatsIcon } from './Icons'
import * as utils from '../utils'

export const Header = ({ seconds, moveCount, showStats, setModalState }) => (
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

    {showStats && (
      <div className="flex justify-between px-4 mb-4 max-w-sm mx-auto">
        <span className="whitespace-nowrap w-[100px] text-left">
          {utils.getHumanizedTime(seconds)}
        </span>

        <span className="whitespace-nowrap w-[300px] font-bold"></span>

        <span className="whitespace-nowrap w-[100px] text-right">
          {moveCount} Move{moveCount === 1 ? '' : 's'}
        </span>
      </div>
    )}
  </>
)
