import { useState } from 'react'
import { Word } from './components/Word'
import * as utils from './utils'
import { HelpIcon, SettingsIcon, StatsIcon } from './components/Icons'
import { HelpModal, SettingsModal, StatsModal } from './components/Modals'
import { useAppState } from './utils/useAppState'

const modalInitialState = { help: false, settings: false, win: false }
function App() {
  const [modalState, _setModalState] = useState(modalInitialState)
  const setModalState = (c) => _setModalState((ms) => ({ ...ms, ...c }))
  const { bindGestures, springs, state, onNewGame } = useAppState({
    onWin: () => setTimeout(() => setModalState({ stats: true }), 2000),
  })

  return (
    <div className="select-none" id="container">
      <header>
        <div className="w-[3rem]">
          <HelpIcon onClick={() => setModalState({ help: true })} />
        </div>

        <h1>QUINTESSENTIAL</h1>
        <div className="flex space-x-2 w-[3rem]">
          <StatsIcon onClick={() => setModalState({ stats: true })} />
          <SettingsIcon onClick={() => setModalState({ settings: true })} />
        </div>
      </header>

      <div className="flex justify-between px-4 mt-5 mb-3 max-w-sm mx-auto">
        <span>{utils.getHumanizedTime(state.seconds)}</span>
        <span>
          {state.moveCount} Move{state.moveCount === 1 ? '' : 's'}
        </span>
      </div>

      <HelpModal
        open={modalState.help}
        onClose={() => setModalState({ help: false })}
      />

      <SettingsModal
        open={modalState.settings}
        onNewGame={onNewGame}
        onClose={() => setModalState({ settings: false })}
      />

      <StatsModal
        onNewGame={onNewGame}
        open={modalState.stats}
        onClose={() => setModalState({ stats: false })}
        {...state}
      />

      <section>
        {state.jumbledWords.map((word, index) => (
          <Word
            key={word}
            word={word}
            index={index}
            springs={springs}
            bindGestures={bindGestures}
            wordState={utils.getWordState(state, index)}
          />
        ))}
      </section>
    </div>
  )
}

export default App
