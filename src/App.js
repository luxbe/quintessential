import { useEffect, useState } from 'react'
import { Word } from './components/Word'
import * as utils from './utils'
import { HelpIcon, SettingsIcon, StatsIcon } from './components/Icons'
import { HelpModal, SettingsModal, StatsModal } from './components/Modals'
import { useAppState } from './utils/useAppState'
// TODO: generated vs designed puzzles (one puzzle per day)
// TODO: share button (day number, num moves, total time)

const modalInitialState = { help: false, settings: false, win: false }
function App() {
  const [modalState, setModalState] = useState(modalInitialState)
  const { bindGestures, springs, state, onNewGame } = useAppState()
  const updateModal = (c) => setModalState((ms) => ({ ...ms, ...c }))

  useEffect(() => {
    if (state.isComplete) {
      setTimeout(() => setModalState({ win: true }), 2000)
    }
  }, [state.isComplete])

  return (
    <div className="select-none" id="container">
      <header>
        <div className="w-[4rem]">
          <HelpIcon onClick={() => updateModal({ help: true })} />
        </div>

        <h1>PENTAJUMBLE</h1>
        <div className="flex space-x-2 w-[4rem]">
          <StatsIcon onClick={() => updateModal({ settings: true })} />
          <SettingsIcon onClick={() => updateModal({ settings: true })} />
        </div>
      </header>

      <HelpModal
        open={modalState.help}
        onClose={() => updateModal({ help: false })}
      />

      <SettingsModal
        open={modalState.settings}
        onNewGame={onNewGame}
        onClose={() => updateModal({ settings: false })}
      />

      <StatsModal
        open={modalState.win}
        onNewGame={onNewGame}
        onClose={() => updateModal({ win: false })}
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

      <p>Moves: {state.moveCount}</p>

      {state.isComplete && (
        <div className="victory">
          <b>You win!</b>
          <button onClick={onNewGame}>New game</button>
        </div>
      )}
    </div>
  )
}

export default App
