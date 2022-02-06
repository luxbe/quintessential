import { useState } from 'react'
import { Word } from './components/Word'
import * as utils from './utils'
import { HelpIcon, SettingsIcon } from './components/Icons'
import { HelpModal, SettingsModal } from './components/Modals'
import { useAppState } from './utils/useAppState'
// TODO: generated vs designed puzzles (one puzzle per day)
// TODO: share button (day number, num moves, total time)

function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { bindGestures, springs, state, onNewGame } = useAppState()

  return (
    <div id="container">
      <header>
        <HelpIcon onClick={() => setHelpOpen(true)} />

        <h1>PENTAJUMBLE</h1>

        <SettingsIcon onClick={() => setSettingsOpen(true)} />
      </header>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal
        open={settingsOpen}
        onNewGame={onNewGame}
        onClose={() => setSettingsOpen(false)}
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
