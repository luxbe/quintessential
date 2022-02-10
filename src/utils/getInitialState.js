import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import { PUZZLES } from './puzzles'
import { getJumbledWords, wordsToEmoji, getTileStateByIndex } from './index'

const isEditMode =
  new URLSearchParams(window.location.search.replace('?', '')).get('e') === ''

const getInitialState = (param) => {
  const _stats = JSON.parse(
    localStorage.getItem(`quintessential-stats`) || '{}',
  )
  let date, solvedWords, jumbledWords, theme
  let puzzleNumber
  let moveCount = 0
  let seconds = 0
  let stats = {
    winCount: 0,
    moveCount: 0,
    secondCount: 0,
    ..._stats,
  }

  if (Array.isArray(param)) {
    solvedWords = param
  } else {
    if (isEditMode) {
      solvedWords = ['fghij', 'klmno', 'pqrst', 'uvwxy', 'abcde']
      jumbledWords = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy']
    } else if (!param) {
      date = new Date()
    } else if (param !== 'random') {
      // if param is a specific days puzzle
      date = new Date(+new Date(param) + 1000 * 60 * 60 * 24)
      date.setHours(0, 0, 0, 0)
    }
    // if a date, get the puzzle for that date
    if (date) {
      const firstDay = new Date('2022-02-07')
      firstDay.setHours(0, 0, 0, 0)
      const day = Number(date) - Number(firstDay)
      puzzleNumber = Math.floor(day / 1000 / 60 / 60 / 24) - 1

      const puzzle = PUZZLES[puzzleNumber]
      solvedWords = puzzle[0].split(',')
      jumbledWords = puzzle[1].split(',')
      theme = puzzle[2]
    }
  }

  // if no puzzle yet, randomly generate one
  solvedWords = solvedWords || shuffle([...WORDS]).slice(0, 5)

  // if no jumble yet, make one
  jumbledWords = jumbledWords || getJumbledWords(solvedWords)

  const save = localStorage.getItem(
    `quintessential-save-${solvedWords.join(',')}`,
  )
  if (save) {
    const [words, other] = save.split(':')
    const [moves, time] = other.split('-')
    jumbledWords = words.split(',')
    moveCount = +moves
    seconds = +time
  }
  const isComplete = solvedWords.every((w, i) => w === jumbledWords[i])

  puzzleNumber = typeof puzzleNumber === 'number' ? puzzleNumber : 'random'

  const state = {
    date,
    solvedWords,
    jumbledWords,
    puzzleNumber,
    moveCount,
    seconds,
    activeIndex: null,
    isComplete,
    stats,
    isEditMode,
    theme,
  }
  state.boardState = wordsToEmoji(
    jumbledWords.map((w, wi) =>
      w.split('').map((l, li) => getTileStateByIndex(state, wi * 5 + li)),
    ),
  )

  return state
}

export default getInitialState
