import { useState, useRef, useEffect } from 'react'
import { Handler } from '@use-gesture/react'
import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'
import * as utils from './index'
import getInitialState from './getInitialState'
import { useStopwatch } from 'react-timer-hook'
import { Stats } from '../types'
import useLocalStorage from './useLocalStorage'

const zero = { x: 0, y: 0 }
const config = { precision: 0.9, friction: 15, tension: 120, clamp: true }
const TIMER_MAX = 999

const ONE_DAY = 1000 * 60 * 60 * 24
const params = new URLSearchParams(window.location.search.replace('?', ''))
const isEditMode = params.get('e') === ''
const puzzleParam = params.get('p')
const todayDateString = new Date(Date.now() - ONE_DAY).toISOString()
const dateString = puzzleParam || todayDateString
const initialState = getInitialState({ dateString, isEditMode })
const initialStats: Stats = {
  winCount: 0,
  moveCount: 0,
  secondCount: 0,
}

export const useAppState = ({ onWin }: { onWin: () => void }) => {
  const [state, setState] = useState(initialState)
  const targetRef = useRef<HTMLElement | null>(null)
  const clickedRef = useRef<HTMLElement | null>(null)
  const isAnimatingRef = useRef<boolean>(false)
  const isTargetAnimatingRef = useRef<boolean>(false)
  const [stats, setStats] = useLocalStorage(
    'quintessential-stats',
    initialStats,
  )

  const [springs, springAPI] = useSprings(25, () => ({
    x: 0,
    y: 0,
    backgroundColor: '#121212',
    config,
  }))

  const offset = new Date()
  offset.setSeconds(offset.getSeconds() + state.seconds)
  const {
    seconds,
    minutes,
    reset: resetStopwatch,
    pause: stopStopwatch,
  } = useStopwatch({
    autoStart: !state.isComplete && !state.isEditMode,
    offsetTimestamp: offset,
  })

  useEffect(() => {
    springAPI.start((i) => ({
      backgroundColor:
        i === +(targetRef.current?.dataset?.index ?? '-1')
          ? '#999'
          : utils.getTileStateByIndex(state, i).color,
    }))
  }, [state, springAPI])

  useEffect(() => {
    if (state.isEditMode) return

    // TODO: useLocalStorage hook
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
    setState(getInitialState({ isEditMode }))
    resetStopwatch()
  }

  const onEditPuzzle = (words: string) => {
    setState(getInitialState({ solvedWords: words.split(','), isEditMode }))
    resetStopwatch()
  }

  const onSelect = (index: number | null) =>
    setState((s) => ({ ...s, activeIndex: index }))

  const getIsComplete = ({
    solvedWords,
    jumbledWords,
  }: {
    solvedWords: string[]
    jumbledWords: string[]
  }) =>
    jumbledWords.every((w, wi) =>
      w.split('').every((c, ci) => c === solvedWords[wi][ci]),
    )

  const onSwap = (index1: number, index2: number) =>
    setState(({ jumbledWords, moveCount, ...state }) => {
      const newJumbledWords = utils.performSwap(jumbledWords, index1, index2)
      const isComplete = getIsComplete({
        solvedWords: state.solvedWords,
        jumbledWords: newJumbledWords,
      })
      if (isComplete && !state.isEditMode) {
        onWin()
        setStats((s: Stats) => ({
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

  const onTap = (tappedEl: HTMLElement) => {
    if (!tappedEl) return

    const index = +(tappedEl.dataset.index ?? '-1')
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
    const a = utils.getTileElementData(tappedEl)
    const b = utils.getTileElementData(clickedRef.current)
    isAnimatingRef.current = true
    onSwap(activeIndex, index)
    tappedEl.classList.remove('drag')

    // animate swaps
    return springAPI.start((i) => {
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
            springAPI.set(zero)
          },
        }
      } else {
        return zero
      }
    })
  }

  const onDrag: Handler<'drag'> = ({
    args,
    first,
    event,
    velocity,
    active,
    movement,
    tap,
  }) => {
    const [draggedIndex] = args
    if (isAnimatingRef.current || state.isComplete) return

    const source = event.target as HTMLElement
    if (!source) return

    if (!source.className.includes('tile')) return

    if (tap) return onTap(source)

    if (first) source.classList.add('drag')
    const a = utils.getTileElementData(source)
    let b = utils.getTileElementData(targetRef.current)
    const [mX, mY] = movement
    const { pageX, pageY } = event as PointerEvent

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
        const target = utils.getTileElementAtXY(pageX, pageY, source)
        if (Math.abs(mX) < 40 && Math.abs(mY) < 40 && targetRef.current) {
          isTargetAnimatingRef.current = true
          targetRef.current = null
          // if we've got a new target, switch if we aren't currently animating a switch
        } else if (target && b.index !== +(target.dataset.index ?? '-1')) {
          isTargetAnimatingRef.current = true
          targetRef.current = target
          b = utils.getTileElementData(target)
        }
      }

      return springAPI.start((i) => {
        if (i === b.index && targetRef.current) {
          // if it is the current swap target, move it so it appears in the source tiles position
          return { x: a.x - b.x, y: a.y - b.y, onRest, backgroundColor: '#999' }
        } else if (i === draggedIndex) {
          // if it is the source tile, move it to the pointer immediately
          const immediate = (k: string) => k === 'x' || k === 'y'
          return { x: mX, y: mY, backgroundColor: '#999', immediate }
        } else {
          // otherwise leave it in it's initial position
          return {
            ...zero,
            backgroundColor: utils.getTileStateByIndex(state, i).color,
            onRest,
          }
        }
      })
    }

    source.classList.remove('drag')
    if (!targetRef.current) {
      targetRef.current = utils.getTileElementAtXY(pageX, pageY, source)
      b = utils.getTileElementData(targetRef.current)
    }

    // if finished dragging and no drop target, cancel
    if (b.index === -1) {
      return springAPI.start((i) => ({
        ...zero,
        backgroundColor: utils.getTileStateByIndex(state, i).color,
        onRest,
      }))
    }

    // otherwise, swap with drop target
    onSwap(a.index, b.index)
    const diff = { x: a.x - b.x, y: a.y - b.y }
    const o = utils.getTranslateXY(targetRef.current)
    targetRef.current = null

    // and animate back into place
    isAnimatingRef.current = true
    springAPI.start((index) => {
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

  return { state, bindGestures, springs, onNewGame, onEditPuzzle, stats }
}
