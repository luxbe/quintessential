import { useState } from 'react'
import { Word } from './components/Word'
import {
  getInitialState,
  getWordState,
  performSwap,
  useWindowEvent,
} from './utils'

// TODO: share button
// TODO: one puzzle per day

const initialState = getInitialState()
function App() {
  const [state, setState] = useState(initialState)
  const onSelect = (index) => setState((s) => ({ ...s, activeIndex: index }))
  const getIsComplete = ({ solvedWords, jumbledWords }) =>
    jumbledWords.every((w, wi) =>
      w.split('').every((c, ci) => c === solvedWords[wi][ci]),
    )

  const onSwap = (index) =>
    setState(({ jumbledWords, activeIndex, moveCount, ...state }) => {
      const newJumbledWords = performSwap(jumbledWords, activeIndex, index)
      return {
        ...state,
        activeIndex: null,
        moveCount: moveCount + 1,
        jumbledWords: newJumbledWords,
        isComplete: getIsComplete({ ...state, jumbledWords: newJumbledWords }),
      }
    })

  useWindowEvent('pointerdown', ({ clientX, clientY }) => {
    let tile = document.elementFromPoint(clientX, clientY)
    if (state.isComplete || !tile.className.includes('tile')) return

    const index = +tile.dataset.index

    // if no tile is selected, select the clicked tile
    if (typeof state.activeIndex !== 'number') return onSelect(index)

    // if we click the selected tile, deselect it
    if (state.activeIndex === index) return onSelect(null)

    // otherwise, swap the active tile with the one we just clicked
    onSwap(index)
  })

  return (
    <div>
      <p>
        Try to get all 5 words correct. Green means the letter is correct.
        Yellow means it is in that word, but not that position in the word.
        White means the letter is not in that word. Click two letters to swap
        their position.
      </p>

      <p>Moves: {state.moveCount}</p>

      {state.isComplete && <b>You win!</b>}

      {state.jumbledWords.map((word, index) => (
        <Word
          key={word}
          word={word}
          index={index}
          wordState={getWordState(state, index)}
        />
      ))}
    </div>
  )
}

export default App
