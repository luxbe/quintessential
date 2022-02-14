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
import { HELP_KEY, MODAL_DURATION } from './constants'

const modalInitialState = {
  help: localStorage.getItem(HELP_KEY) !== '1',
  settings: false,
  stats: false,
}
localStorage.setItem(HELP_KEY, '1')

const App = () => {
  const [modalState, _setModalState] = useState(modalInitialState)
  const setModalState = (c: Record<string, unknown>) =>
    _setModalState((ms) => ({ ...ms, ...c }))

  const onWin = () =>
    setTimeout(() => setModalState({ stats: true }), MODAL_DURATION)
  const { state, ...helpers } = useAppState({ onWin })

  return (
    <>
      <div id="container">
        <Header
          theme={state.theme}
          puzzleNumber={state.puzzleNumber}
          date={state.date}
          setModalState={setModalState}
        />

        <div className="-mt-[0.5rem] flex flex-col items-center justify-center max-w-sm mx-auto">
          {state.jumbledWords.map((word: string, index: number) => (
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
        </div>

        {state.isEditMode ? (
          <PuzzleEditor
            onJumble={helpers.onEditPuzzle}
            jumbledWords={state.jumbledWords}
          />
        ) : (
          <Footer
            seconds={state.seconds}
            moveCount={state.moveCount}
            timer={helpers.settings?.timer}
          />
        )}
      </div>

      <HelpModal
        open={modalState.help}
        onClose={() => setModalState({ help: false })}
      />

      <SettingsModal
        open={modalState.settings}
        onRandomGame={helpers.onRandomGame}
        settings={helpers.settings}
        setSettings={helpers.setSettings}
        onClose={() => setModalState({ settings: false })}
      />

      <StatsModal
        open={modalState.stats}
        isComplete={state.isComplete}
        puzzleNumber={state.puzzleNumber}
        moveCount={state.moveCount}
        seconds={state.seconds}
        boardState={state.boardState}
        stats={helpers.stats}
        settings={helpers.settings}
        onClose={() => setModalState({ stats: false })}
      />
    </>
  )
}

export default App
