import { ONE_DAY } from '../constants'
import { GameState } from '../types'
import { applySave, getBoardState, getJumbledWords, getPuzzle } from './index'

const getInitialState = ({
  dateString,
  solvedWords,
  jumbledWords,
  isEditMode = false,
}: {
  isEditMode?: boolean
  dateString?: string
  solvedWords?: string
  jumbledWords?: string
} = {}): GameState => {
  const date = dateString
    ? new Date(+new Date(dateString) + ONE_DAY)
    : undefined

  const puzzle = getPuzzle(date)

  let state: GameState = {
    moveCount: 0,
    seconds: 0,
    activeIndex: null,
    isComplete: false,
    boardState: '',
    date,
    isEditMode,
    ...puzzle,
  }

  if (solvedWords) {
    state.solvedWords = solvedWords.split(',')
    state.jumbledWords = jumbledWords
      ? jumbledWords.split(',')
      : getJumbledWords(state.solvedWords)
  } else if (isEditMode) {
    state.solvedWords = ['fghij', 'klmno', 'pqrst', 'uvwxy', 'abcde']
    state.jumbledWords = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy']
  }

  state.boardState = getBoardState(state)

  state = applySave(state)

  state.isComplete = state.solvedWords.every(
    (w, i) => w === state.jumbledWords[i],
  )

  return state
}

export default getInitialState
