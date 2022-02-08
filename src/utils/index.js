import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import chunk from 'lodash/chunk'
import { PUZZLES } from './puzzles'

const GENERATE_SOLVE = false

export const getJumbledWords = (solvedWords, swaps = 8) => {
  const letters = solvedWords.join('').split('')

  // get 8 pairs of letters that don't match and swap them
  const indexes = shuffle(new Array(25).fill('').map((_, i) => i))
  chunk(indexes, 2)
    .filter(([a, b]) => letters[a] !== letters[b])
    .slice(0, swaps)
    .forEach((swap) => {
      const temp = letters[swap[0]]
      letters[swap[0]] = letters[swap[1]]
      letters[swap[1]] = temp
    })

  return chunk(letters, 5).map((w) => w.join(''))
}

export const getInitialState = (param) => {
  const _stats = JSON.parse(
    localStorage.getItem(`quintessential-stats`) || '{}',
  )
  let puzzle, date
  let puzzleNumber
  let moveCount = 0
  let seconds = 0
  let stats = {
    winCount: 0,
    moveCount: 0,
    secondCount: 0,
    ..._stats,
  }

  if (!param) {
    date = new Date()
  } else if (param !== 'random') {
    date = new Date(new Date(param) + 1000 * 60 * 60 * 24)
    date.setHours(0, 0, 0, 0)
  }

  if (date) {
    const firstDay = new Date('2022-02-07')
    firstDay.setHours(0, 0, 0, 0)
    const day = Number(date) - Number(firstDay)
    const dayIndex = Math.floor(day / 1000 / 60 / 60 / 24) - 1
    puzzleNumber = dayIndex
    puzzle = PUZZLES[dayIndex]
    if (puzzle) {
      if (GENERATE_SOLVE) {
        puzzle[1] = getJumbledWords(puzzle[0].split(',')).join(',')
      }

      puzzle = puzzle.map((p) => p.split(','))
    }
  }

  if (!puzzle) {
    const solved = shuffle([...WORDS]).slice(0, 5)
    puzzle = [solved, getJumbledWords(solved)]
  }
  let [solvedWords, jumbledWords] = puzzle

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
    solvedWords,
    jumbledWords,
    puzzleNumber,
    moveCount,
    seconds,
    activeIndex: null,
    isComplete,
    stats,
  }
  state.boardState = wordsToEmoji(
    jumbledWords.map((w, wi) =>
      w.split('').map((l, li) => getLetterState(state, wi * 5 + li)),
    ),
  )

  return state
}

export const performSwap = (words, i1, i2) => {
  const str = words.join('').split('')
  const temp = str[i1]
  str[i1] = str[i2]
  str[i2] = temp
  return chunk(str.join(''), 5).map((s) => s.join(''))
}

export const getWordState = (state, index) =>
  new Array(5).fill('').map((_, i) => getLetterState(state, index * 5 + i))

export const getLetterState = (
  { jumbledWords, solvedWords, activeIndex },
  index,
) => {
  const wordIndex = Math.floor(index / 5)
  const solvedWord = solvedWords[wordIndex].split('')
  const jumbledWord = jumbledWords[wordIndex].split('')
  const solvedLetter = solvedWord[index % 5]
  const jumbledLetter = jumbledWord[index % 5]
  const unsolvedLetters = solvedWord.filter((l, i) => jumbledWord[i] !== l)

  // is this tile selected?
  const active = activeIndex === index

  // is this tile in the right word and position?
  const correct = solvedLetter === jumbledLetter

  // is this tile in the right word but wrong position?
  const almost = !correct && unsolvedLetters.includes(jumbledLetter)
  const state = correct ? 1 : almost ? 2 : 0
  const COLORS = ['#3a3a3c', '#528a4c', '#a39035']
  const color = COLORS[state]

  return { index, active, color, state }
}

export const getTranslateXY = (element) => {
  if (!element) return { x: 0, y: 0 }
  const style = window.getComputedStyle(element)
  const matrix = new DOMMatrixReadOnly(style.transform)
  return { x: matrix.m41, y: matrix.m42 }
}

export const getBackgroundColor = (element) =>
  element
    ? window
        .getComputedStyle(element, null)
        .getPropertyValue('background-color')
    : null

export const getTileEl = (el) => ({
  x: el ? el.offsetLeft : null,
  y: el ? el.offsetTop : null,
  color: el ? getBackgroundColor(el) : null,
  index: el ? +el.dataset.index : null,
})

export const getTileAtXY = (x, y, _el) =>
  document
    .elementsFromPoint(x, y)
    .find((el) => el.classList.contains('tile') && el !== _el)

export const getHumanizedTime = (s) =>
  `${Math.floor(s / 60)}:${padNum(Math.floor(s % 60))}`

export const padNum = (n) => n.toString().padStart(2, '0')

const EMOJI = ['⬛', '🟩', '🟨']
export const wordsToEmoji = (words) =>
  words.map((w) => w.map((l) => EMOJI[l.state]).join('')).join('\n')
