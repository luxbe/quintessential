import { useState } from 'react'
import { Word } from './components/Word'
import { HelpIcon, SettingsIcon, StatsIcon } from './components/Icons'
import { HelpModal, SettingsModal, StatsModal } from './components/Modals'
import { PuzzleEditor } from './components/PuzzleEditor'
import { GameStats } from './components/GameStats'
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

      {!state.isEditMode && (
        <GameStats
          moveCount={state.moveCount}
          theme={state.theme}
          time={state.seconds}
        />
      )}

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

      <section>
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

      {state.isEditMode && (
        <PuzzleEditor
          onJumble={helpers.onEditPuzzle}
          jumbledWords={state.jumbledWords}
        />
      )}
    </div>
  )
}

export default App
