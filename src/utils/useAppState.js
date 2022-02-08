import { useState, useRef, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import * as utils from './index'
import { useStopwatch } from 'react-timer-hook'

const zero = { x: 0, y: 0 }
const config = { precision: 0.9, friction: 15, tension: 120, clamp: true }
const TIMER_MAX = 999

const puzzle = new URLSearchParams(window.location.search.replace('?', '')).get(
  'p',
)
const initialState = utils.getInitialState(puzzle)

export const useAppState = ({ onWin }) => {
  const [state, setState] = useState(initialState)
  const targetRef = useRef()
  const clickedRef = useRef()
  const isAnimatingRef = useRef()
  const isTargetAnimatingRef = useRef()
  const [springs, api] = useSprings(25, () => ({
    x: 0,
    y: 0,
    backgroundColor: '#121212',
    config,
  }))

  const updateStats = (fn) => {
    setState((s) => {
      localStorage.setItem('quintessential-stats', JSON.stringify(fn(s.stats)))
      return { ...s, stats: fn(s.stats) }
    })
  }

  const offset = new Date()
  offset.setSeconds(offset.getSeconds() + state.seconds)
  const {
    seconds,
    minutes,
    reset: resetStopwatch,
    pause: stopStopwatch,
  } = useStopwatch({
    autoStart: !state.isComplete,
    offsetTimestamp: offset,
  })

  useEffect(() => {
    api.start((i) => ({
      backgroundColor: utils.getLetterState(state, i).color,
    }))
  }, [state, api])

  useEffect(() => {
    localStorage.setItem(
      `quintessential-save-${state.solvedWords.join(',')}`,
      `${state.jumbledWords.join(',')}:${state.moveCount}-${state.seconds}`,
    )
  }, [state])

  useEffect(() => {
    if (seconds + minutes * 60 < TIMER_MAX)
      setState((s) => ({ ...s, seconds: seconds + minutes * 60 }))
  }, [seconds, minutes])

  const onNewGame = () => {
    setState(utils.getInitialState('random'))
    resetStopwatch()
  }

  const onSelect = (index) => setState((s) => ({ ...s, activeIndex: index }))

  const getIsComplete = ({ solvedWords, jumbledWords }) =>
    jumbledWords.every((w, wi) =>
      w.split('').every((c, ci) => c === solvedWords[wi][ci]),
    )

  const onSwap = (index1, index2) =>
    setState(({ jumbledWords, moveCount, ...state }) => {
      const newJumbledWords = utils.performSwap(jumbledWords, index1, index2)
      const isComplete = getIsComplete({
        ...state,
        jumbledWords: newJumbledWords,
      })
      if (isComplete) {
        onWin()
        updateStats((s) => ({
          ...s,
          winCount: s.winCount + 1,
          moveCount: s.moveCount + moveCount + 1,
          secondCount: s.secondCount + state.seconds,
        }))
        stopStopwatch()
      }

      return {
        ...state,
        activeIndex: null,
        moveCount: moveCount + 1,
        jumbledWords: newJumbledWords,
        isComplete,
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
          to: zero,
        }
      } else if (i === index) {
        return {
          from: { x: b.x - a.x, y: b.y - a.y, backgroundColor: b.color },
          to: zero,
          onRest: () => {
            clickedRef.current = null
            isAnimatingRef.current = false
            api.set(zero)
          },
        }
      } else {
        return zero
      }
    })
  }

  const onDrag = ({ args, first, event, velocity, active, movement, tap }) => {
    const [draggedIndex] = args
    if (isAnimatingRef.current || state.isComplete) return

    const source = event.target
    if (!source.className.includes('tile') || source.dataset.correct === 'true')
      return

    if (tap) return onTap(event.target)

    if (first) source.classList.add('drag')
    const a = utils.getTileEl(source)
    let b = utils.getTileEl(targetRef.current)
    const [mX, mY] = movement

    // const _targetRef = targetRef.current
    const onRest = () => {
      isAnimatingRef.current = false
      isTargetAnimatingRef.current = false
    }

    // actively dragging
    if (active) {
      const speed = Math.abs(velocity[0]) + Math.abs(velocity[1])
      // if close to source original position, preview cancel
      if (speed < 0.1) {
        const target = utils.getTileAtXY(event.pageX, event.pageY, source)
        if (Math.abs(mX) < 40 && Math.abs(mY) < 40 && targetRef.current) {
          isTargetAnimatingRef.current = true
          targetRef.current = null
          // if we've got a new target, switch if we aren't currently animating a switch
        } else if (target && b.index !== +target.dataset.index) {
          isTargetAnimatingRef.current = true
          targetRef.current = target
          b = utils.getTileEl(target)
        }
      }

      return api.start((i) => {
        if (i === b.index && targetRef.current) {
          // if it is the current swap target, move it so it appears in the source tiles position
          return { x: a.x - b.x, y: a.y - b.y, onRest, backgroundColor: '#888' }
        } else if (i === draggedIndex) {
          // if it is the source tile, move it to the pointer immediately
          const immediate = (k) => k === 'x' || k === 'y'
          return { x: mX, y: mY, backgroundColor: '#888', immediate }
        } else {
          // otherwise leave it in it's initial position
          return {
            ...zero,
            backgroundColor: utils.getLetterState(state, i).color,
            onRest,
          }
        }
      })
    }

    source.classList.remove('drag')
    if (!targetRef.current) {
      targetRef.current = utils.getTileAtXY(event.pageX, event.pageY, source)
      b = utils.getTileEl(targetRef.current)
    }

    // if finished dragging and no drop target, cancel
    if (typeof b.index !== 'number') {
      return api.start((i) => ({
        ...zero,
        backgroundColor: utils.getLetterState(state, i).color,
        onRest,
      }))
    }

    // otherwise, swap with drop target
    onSwap(a.index, b.index)
    const diff = { x: a.x - b.x, y: a.y - b.y }
    const o = utils.getTranslateXY(targetRef.current)
    targetRef.current = undefined

    // and animate back into place
    isAnimatingRef.current = true
    api.start((index) => {
      if (index === b.index) {
        return {
          from: { x: mX + diff.x, y: mY + diff.y, backgroundColor: a.color },
          to: zero,
          onRest,
        }
      }
      if (index === draggedIndex) {
        return {
          from: { x: o.x - diff.x, y: o.y - diff.y, backgroundColor: b.color },
          to: zero,
        }
      }
      return zero
    })
  }

  const bindGestures = useDrag(onDrag)

  return { bindGestures, springs, state, onNewGame }
}
