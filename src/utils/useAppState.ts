import { useState, useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { AppState, Stats } from '../types'
import * as constants from '../constants'
import * as utils from './index'
import getInitialState from './getInitialState'
import useLocalStorage from './useLocalStorage'
import useGestures from './useGestures'

const initialStats: Stats = { winCount: 0, moveCount: 0, secondCount: 0 }
const { dateString, isEditMode, jumbledWords, solvedWords } = utils.getParams()
const initialState = getInitialState({
  dateString,
  isEditMode,
  solvedWords,
  jumbledWords,
})

export const useAppState = ({ onWin }: { onWin: () => void }): AppState => {
  const [state, setState] = useState(initialState)
  const [message, setMessage] = useState('')
  const offsetTimestamp = new Date(Date.now() + state.seconds * 1000)
  const autoStart = !state.isComplete && !state.isEditMode
  const stopwatch = useStopwatch({ autoStart, offsetTimestamp })
  const [settings, setSettings] = useLocalStorage(constants.SETTINGS_KEY, {})
  const [stats, setStats] = useLocalStorage(constants.STATS_KEY, initialStats)

  useEffect(() => {
    utils.track('event', 'level_start', {
      level_name: initialState.puzzleNumber,
    })
  }, [])

  useEffect(() => {
    if (!state.isEditMode) utils.saveGame(state)
  }, [state])

  useEffect(() => {
    const newTime = stopwatch.seconds + stopwatch.minutes * 60
    if (newTime < constants.TIMER_MAX) {
      setState((s) => ({ ...s, seconds: newTime }))
    }
  }, [stopwatch.seconds, stopwatch.minutes])

  const onRandomGame = () => {
    setState(getInitialState({ isEditMode }))
    utils.track('event', 'level_start', { level_name: 'random' })
    stopwatch.reset()
  }

  const onEditPuzzle = (words: string) => {
    setState(getInitialState({ solvedWords: words, isEditMode }))
    stopwatch.reset()
  }

  const onSelect = (index: number | null) =>
    setState((s) => ({ ...s, activeIndex: index }))

  const onSwap = (index1: number, index2: number) =>
    setState((state) => {
      const activeIndex = null
      const solvedWords = state.solvedWords
      const moveCount = state.moveCount + 1
      const jumbledWords = utils.performSwap(state.jumbledWords, index1, index2)
      const isComplete = utils.getIsComplete({ solvedWords, jumbledWords })

      utils.track('event', 'swap')

      if (isComplete && !state.isEditMode) {
        utils.track('event', 'level_end', { level_name: state.puzzleNumber })
        stopwatch.pause()
        setStats((s: Stats) => ({
          ...s,
          winCount: s.winCount + 1,
          moveCount: s.moveCount + moveCount,
          secondCount: s.secondCount + state.seconds,
        }))

        setTimeout(() => {
          setMessage(utils.getMessageFromMoveCount(moveCount))
          onWin()
        }, 500)
      }

      return { ...state, activeIndex, moveCount, jumbledWords, isComplete }
    })

  const { bindGestures, springs } = useGestures({ state, onSwap, onSelect })

  return {
    state,
    stats,
    settings,
    bindGestures,
    springs,
    onRandomGame,
    onEditPuzzle,
    setStats,
    setSettings,
    message,
    setMessage,
  }
}
