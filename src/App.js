import { useState, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import { Word } from './components/Word'
import {
  getBackgroundColor,
  getInitialState,
  getLetterState,
  getTranslateXY,
  getWordState,
  performSwap,
} from './utils'
// TODO: share button
// TODO: one puzzle per day

const initialState = getInitialState()
function App() {
  const [state, setState] = useState(initialState)
  const onSelect = (index) => setState((s) => ({ ...s, activeIndex: index }))
  const [springs, api] = useSprings(25, (i) => ({
    x: 0,
    y: 0,
    backgroundColor: getLetterState(state, i).color,
  }))
  const droppedRef = useRef()
  const clickedRef = useRef()
  const isAnimatingRef = useRef()

  const onDrag = ({ args: [draggedIndex], event, active, movement, tap }) => {
    const dragged = event.target
    if (
      isAnimatingRef.current ||
      state.isComplete ||
      !dragged.className.includes('tile')
    )
      return

    if (tap) {
      const index = +dragged.dataset.index

      // if no tile is selected, select the clicked tile
      if (typeof state.activeIndex !== 'number') {
        clickedRef.current = event.target
        onSelect(index)
        return
      }

      // if we click the selected tile, deselect it
      if (state.activeIndex === index) {
        onSelect(null)
        return
      }

      // otherwise, swap the active tile with the one we just clicked
      const activeIndex = state.activeIndex
      isAnimatingRef.current = true
      onSwap(activeIndex, index)
      api.start((i) => {
        if (i === activeIndex) {
          return {
            from: {
              x: event.target.offsetLeft - clickedRef.current.offsetLeft,
              y: event.target.offsetTop - clickedRef.current.offsetTop,
              backgroundColor: getBackgroundColor(event.target),
            },
            to: { x: 0, y: 0 },
          }
        } else if (i === draggedIndex) {
          return {
            from: {
              x: clickedRef.current.offsetLeft - event.target.offsetLeft,
              y: clickedRef.current.offsetTop - event.target.offsetTop,
              backgroundColor: getBackgroundColor(clickedRef.current),
            },
            to: { x: 0, y: 0 },

            onRest: () => {
              clickedRef.current = null
              isAnimatingRef.current = false
              api.set({ x: 0, y: 0 })
            },
          }
        } else {
          return { x: 0, y: 0 }
        }
      })
      onSelect(null)
      return
    }

    // drag
    let dropTarget = document
      .elementsFromPoint(event.pageX, event.pageY)
      .find((d) => d.classList.contains('tile') && d !== dragged)

    if (
      dropTarget &&
      active &&
      droppedRef.current?.dataset.index !== dropTarget.dataset.index
    ) {
      droppedRef.current = dropTarget
    }

    // TODO if there is no drop target, return everything back to normal positions somehow
    let dropIndex = droppedRef.current
      ? +droppedRef.current?.dataset.index
      : null

    if (active) {
      if (Math.abs(movement[0]) < 20 && Math.abs(movement[1]) < 20) {
        dropIndex = null
        droppedRef.current = null
      }
      api.start((i) => {
        // if it is the current swap target, move it so it appears in the dragged tiles position
        if (i === dropIndex) {
          return {
            x: dragged?.offsetLeft - droppedRef.current?.offsetLeft,
            y: dragged?.offsetTop - droppedRef.current?.offsetTop,
          }
        }
        // if it is the dragged tile, move it to the pointer immediately
        if (i === draggedIndex) {
          return { x: movement[0], y: movement[1], immediate: true }
          // otherwise leave it in it's initial position
        } else {
          return { x: 0, y: 0 }
        }
      })
      return
    }

    if (typeof dropIndex !== 'number') {
      api.start({ x: 0, y: 0 })
      return
    }

    const drag = { x: dragged.offsetLeft, y: dragged.offsetTop }
    const drop = {
      x: droppedRef.current.offsetLeft,
      y: droppedRef.current.offsetTop,
    }
    const d = { x: drag.x - drop.x, y: drag.y - drop.y }
    const current = getTranslateXY(droppedRef.current)
    droppedRef.current = undefined

    onSwap(+dragged.dataset.index, dropIndex)

    isAnimatingRef.current = true
    api.start((index) => {
      if (index === dropIndex) {
        const [x, y] = movement
        const onRest = () => (isAnimatingRef.current = false)
        return { from: { x: x + d.x, y: y + d.y }, to: { x: 0, y: 0 }, onRest }
      }
      if (index === draggedIndex) {
        const { x, y } = current
        return { from: { x: x - d.x, y: y - d.y }, to: { x: 0, y: 0 } }
      }
      return { x: 0, y: 0 }
    })
  }

  api.start((i) => ({
    backgroundColor: getLetterState(state, i).color,
  }))

  const getIsComplete = ({ solvedWords, jumbledWords }) =>
    jumbledWords.every((w, wi) =>
      w.split('').every((c, ci) => c === solvedWords[wi][ci]),
    )

  const onSwap = (index1, index2) =>
    setState(({ jumbledWords, moveCount, ...state }) => {
      const newJumbledWords = performSwap(jumbledWords, index1, index2)
      return {
        ...state,
        activeIndex: null,
        moveCount: moveCount + 1,
        jumbledWords: newJumbledWords,
        isComplete: getIsComplete({ ...state, jumbledWords: newJumbledWords }),
      }
    })

  const bind = useDrag(onDrag)

  return (
    <div className="container">
      <p>
        Try to get all 5 words correct. Green means the letter is correct.
        Yellow means it is in that word, but not that position in the word.
        White means the letter is not in that word. Click two letters to swap
        their position.
      </p>

      <div className="board">
        {state.jumbledWords.map((word, index) => (
          <Word
            key={word}
            word={word}
            index={index}
            bind={bind}
            springs={springs}
            wordState={getWordState(state, index)}
          />
        ))}
      </div>
      <p>Moves: {state.moveCount}</p>

      {state.isComplete && <b>You win!</b>}
    </div>
  )
}

export default App
