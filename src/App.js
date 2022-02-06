import { useState } from 'react'
import { Word } from './components/Word'
import * as utils from './utils'
import { HelpIcon, SettingsIcon } from './components/Icons'
import { HelpModal, SettingsModal } from './components/Modals'
import { useAppState } from './utils/useAppState'
// TODO: share button
// TODO: one puzzle per day

function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { bindGestures, springs, state } = useAppState()

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

      {state.isComplete && <b>You win!</b>}
    </div>
  )
}

export default App
