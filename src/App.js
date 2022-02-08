import { useState } from 'react'
import { Word } from './components/Word'
import * as utils from './utils'
import { HelpIcon, SettingsIcon, StatsIcon } from './components/Icons'
import { HelpModal, SettingsModal, StatsModal } from './components/Modals'
import { useAppState } from './utils/useAppState'
// TODO: generated vs designed puzzles (one puzzle per day)
// TODO: share button (day number, num moves, total time)

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

      <p>
        Time: {state.seconds}, Moves: {state.moveCount}
      </p>

      {state.isComplete && (
        <div className="flex flex-col items-center space-y-4">
          <b>You win!</b>
          {/* <button onClick={onNewGame}>New game</button> */}
        </div>
      )}
    </div>
  )
}

export default App
