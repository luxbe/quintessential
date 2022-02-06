import { useState, useRef, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import * as utils from './index'

const initialState = utils.getInitialState()
export const useAppState = () => {
  const [state, setState] = useState(initialState)
  const targetRef = useRef()
  const clickedRef = useRef()
  const isAnimatingRef = useRef()
  const [springs, api] = useSprings(25, () => ({
    x: 0,
    y: 0,
    backgroundColor: '#121212',
    config: { precision: 0.5 },
  }))

  useEffect(() => {
    api.start((i) => ({
      backgroundColor: utils.getLetterState(state, i).color,
    }))
  }, [state, api])

  const onSelect = (index) => setState((s) => ({ ...s, activeIndex: index }))

  const getIsComplete = ({ solvedWords, jumbledWords }) =>
    jumbledWords.every((w, wi) =>
      w.split('').every((c, ci) => c === solvedWords[wi][ci]),
    )

  const onSwap = (index1, index2) =>
    setState(({ jumbledWords, moveCount, ...state }) => {
      const newJumbledWords = utils.performSwap(jumbledWords, index1, index2)
      return {
        ...state,
        activeIndex: null,
        moveCount: moveCount + 1,
        jumbledWords: newJumbledWords,
        isComplete: getIsComplete({ ...state, jumbledWords: newJumbledWords }),
      }
    })

  const onTap = (tappedEl) => {
    const index = +tappedEl.dataset.index
    const activeIndex = state.activeIndex

    // if no tile is selected, select the clicked tile
    if (typeof activeIndex !== 'number') {
      clickedRef.current = tappedEl
      return onSelect(index)
    }

    // if we click the selected tile, deselect it
    if (activeIndex === index) {
      return onSelect(null)
    }

    // otherwise, swap the active tile with the one we just clicked
    const a = utils.getTileEl(tappedEl)
    const b = utils.getTileEl(clickedRef.current)
    isAnimatingRef.current = true
    onSwap(activeIndex, index)

    // animate swaps
    return api.start((i) => {
      if (i === activeIndex) {
        return {
          from: { x: a.x - b.x, y: a.y - b.y, backgroundColor: a.color },
          to: { x: 0, y: 0 },
        }
      } else if (i === index) {
        return {
          from: { x: b.x - a.x, y: b.y - a.y, backgroundColor: b.color },
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
  }

  const onDrag = ({ args: [draggedIndex], event, active, movement, tap }) => {
    if (isAnimatingRef.current || state.isComplete) return

    const source = event.target
    if (!source.className.includes('tile')) return

    if (tap) return onTap(event.target)

    const a = utils.getTileEl(source)
    let b = utils.getTileEl(targetRef.current)
    const target = utils.getTileAtXY(event.pageX, event.pageY, source)
    const [mX, mY] = movement

    // actively dragging
    if (active) {
      // if close to source original position, preview cancel
      if (Math.abs(mX) < 20 && Math.abs(mY) < 20) {
        targetRef.current = null
        // if we've got a new target, switch
      } else if (target && b.index !== +target.dataset.index) {
        targetRef.current = target
        b = utils.getTileEl(target)
      }

      return api.start((i) => {
        if (i === b.index && targetRef.current) {
          // if it is the current swap target, move it so it appears in the source tiles position
          return { x: a.x - b.x, y: a.y - b.y }
        } else if (i === draggedIndex) {
          // if it is the source tile, move it to the pointer immediately
          return { x: mX, y: mY, immediate: true }
        } else {
          // otherwise leave it in it's initial position
          return { x: 0, y: 0 }
        }
      })
    }

    // if finished dragging and no drop target, cancel
    if (typeof b.index !== 'number') {
      return api.start({ x: 0, y: 0 })
    }

    // otherwise, swap with drop target
    const o = utils.getTranslateXY(targetRef.current)
    targetRef.current = undefined
    onSwap(a.index, b.index)
    const diff = { x: a.x - b.x, y: a.y - b.y }

    // and animate back into place
    isAnimatingRef.current = true
    api.start((index) => {
      if (index === b.index) {
        return {
          from: { x: mX + diff.x, y: mY + diff.y, backgroundColor: a.color },
          to: { x: 0, y: 0 },
          onRest: () => (isAnimatingRef.current = false),
        }
      }
      if (index === draggedIndex) {
        return {
          from: { x: o.x - diff.x, y: o.y - diff.y, backgroundColor: b.color },
          to: { x: 0, y: 0 },
        }
      }
      return { x: 0, y: 0 }
    })
  }

  const bindGestures = useDrag(onDrag)

  return { bindGestures, springs, state }
}
