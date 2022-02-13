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
import useLocalStorage from './utils/useLocalStorage'

const modalInitialState = {
  help: localStorage.getItem('quint-help') !== '1',
  settings: false,
  stats: false,
}
localStorage.setItem('quint-help', '1')

const App = () => {
  const [modalState, _setModalState] = useState(modalInitialState)
  const [settings, setSettings] = useLocalStorage('quint-settings', {})

  const setModalState = (c: Record<string, unknown>) =>
    _setModalState((ms) => ({ ...ms, ...c }))
  const { state, ...helpers } = useAppState({
    onWin: () => setTimeout(() => setModalState({ stats: true }), 2000),
  })

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
            timer={settings?.timer}
          />
        )}
      </div>

      <HelpModal
        open={modalState.help}
        onClose={() => setModalState({ help: false })}
      />

      <SettingsModal
        open={modalState.settings}
        onNewGame={helpers.onNewGame}
        settings={settings}
        setSettings={setSettings}
        onClose={() => setModalState({ settings: false })}
      />

      <StatsModal
        settings={settings}
        open={modalState.stats}
        onClose={() => setModalState({ stats: false })}
        isComplete={state.isComplete}
        moveCount={state.moveCount}
        seconds={state.seconds}
        puzzleNumber={state.puzzleNumber}
        stats={helpers.stats}
        boardState={state.boardState}
      />
    </>
  )
}

export default App
