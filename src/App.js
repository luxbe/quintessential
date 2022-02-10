import { useState } from 'react'
import { Word } from './components/Word'
import { StatsModal } from './components/StatsModal'
import { SettingsModal } from './components/SettingsModal'
import { HelpModal } from './components/HelpModal'
import { PuzzleEditor } from './components/PuzzleEditor'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import * as utils from './utils'
import { useAppState } from './utils/useAppState'

const modalInitialState = { help: false, settings: false, win: false }

function App() {
  const [modalState, _setModalState] = useState(modalInitialState)
  const setModalState = (c) => _setModalState((ms) => ({ ...ms, ...c }))
  const { state, ...helpers } = useAppState({
    onWin: () => setTimeout(() => setModalState({ stats: true }), 2000),
  })

  return (
    <div id="container">
      <Header
        seconds={state.seconds}
        showStats={!state.isEditMode}
        moveCount={state.moveCount}
        setModalState={setModalState}
      />

      <HelpModal
        open={modalState.help}
        onClose={() => setModalState({ help: false })}
      />

      <SettingsModal
        open={modalState.settings}
        onNewGame={helpers.onNewGame}
        onClose={() => setModalState({ settings: false })}
      />

      <StatsModal
        onNewGame={helpers.onNewGame}
        open={modalState.stats}
        onClose={() => setModalState({ stats: false })}
        {...state}
      />

      <section className="select-none">
        {state.jumbledWords.map((word, index) => (
          <Word
            key={word}
            word={word}
            index={index}
            springs={helpers.springs}
            bindGestures={helpers.bindGestures}
            isEditMode={state.isEditMode}
            wordState={utils.getWordState(state, index)}
          />
        ))}
      </section>

      {state.isEditMode ? (
        <PuzzleEditor
          onJumble={helpers.onEditPuzzle}
          jumbledWords={state.jumbledWords}
        />
      ) : (
        <Footer
          theme={state.theme}
          puzzleNumber={state.puzzleNumber}
          date={state.date}
        />
      )}
    </div>
  )
}

export default App
