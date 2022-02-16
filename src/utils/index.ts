import shuffle from 'lodash/shuffle'
import chunk from 'lodash/chunk'
import { GameState, TileElementData, TileState } from '../types'
import { WORDS } from '../constants/puzzles'
import { PUZZLES } from '../constants/puzzles'
import { ONE_DAY, SAVE_KEY } from '../constants'

const getBackgroundColor = (element: HTMLElement) =>
  element
    ? window
        .getComputedStyle(element, null)
        .getPropertyValue('background-color')
    : 'transparent'

const padNum = (n: number) => n.toString().padStart(2, '0')

const EMOJI = ['⬛', '🟩', '🟨']
const COLORS = ['#3a3a3c', '#528a4c', '#a39035']

const wordsToEmoji = (words: TileState[][]) =>
  words
    .map((w: TileState[]) => w.map((l) => EMOJI[l.state]).join(''))
    .join('\n')

const firstDay = new Date('2022-02-07')
firstDay.setHours(0, 0, 0, 0)

export const getJumbledWords = (solvedWords: string[], swaps = 8) => {
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

export const getTileStateByIndex = (
  {
    jumbledWords,
    solvedWords,
    activeIndex,
  }: {
    jumbledWords: string[]
    solvedWords: string[]
    activeIndex: number | null
  },
  index: number,
): TileState => {
  const wordIndex = Math.floor(index / 5)
  const word = jumbledWords[wordIndex].split('')
  const solvedWord = solvedWords[wordIndex].split('')
  const char = word[index % 5]
  const solvedLetter = solvedWord[index % 5]
  const unsolvedLetters = solvedWord.filter((l, i) => word[i] !== l)

  // is this tile selected?
  const active = activeIndex === index

  // is this tile in the right word and position?
  const correct = solvedLetter === char

  // is this tile in the right word but wrong position?
  const belongsToWord = unsolvedLetters.includes(char)
  const dupeCount = word.filter((l, li) => l === char && li < index % 5).length
  const solvedDupeCount = solvedWord.filter((l) => l === char).length
  // TODO: this can still fail if the solved duplicates come _after_ the current position of the 2 letters
  const almost = !correct && belongsToWord && dupeCount < solvedDupeCount
  const state = correct ? 1 : almost ? 2 : 0
  const color = COLORS[state]

  return { index, active, color, state, correct }
}

export const getWordState = (state: GameState, index: number) =>
  new Array(5).fill('').map((_, i) => getTileStateByIndex(state, index * 5 + i))

export const performSwap = (words: string[], i1: number, i2: number) => {
  const str = words.join('').split('')
  const temp = str[i1]
  str[i1] = str[i2]
  str[i2] = temp
  return chunk(str.join(''), 5).map((s) => s.join(''))
}

export const getTranslateXY = (element: HTMLElement) => {
  if (!element) return { x: 0, y: 0 }
  const style = window.getComputedStyle(element)
  const matrix = new DOMMatrixReadOnly(style.transform)
  return { x: matrix.m41, y: matrix.m42 }
}

export const getTileElementData = (
  el: HTMLElement | null,
): TileElementData => ({
  x: el ? el.offsetLeft : -1,
  y: el ? el.offsetTop : -1,
  color: el ? getBackgroundColor(el) : 'transparent',
  index: el ? +(el.dataset.index ?? '-1') : -1,
})

export const getTileElementAtXY = (
  x: number,
  y: number,
  _el: HTMLElement,
): HTMLElement =>
  document
    .elementsFromPoint(x, y)
    .find((el) => el.classList.contains('tile') && el !== _el) as HTMLElement

export const getHumanizedTime = (s: number) =>
  `${Math.floor(s / 60)}:${padNum(Math.floor(s % 60))}`

export const validatePuzzleString = (s: string) => /(([a-z]){5},?){5}/.test(s)

export const getRandomWords = () => shuffle([...WORDS]).slice(0, 5)

export const getBoardState = (state: GameState) =>
  wordsToEmoji(
    state.jumbledWords.map((w, wi) =>
      w.split('').map((l, li) => getTileStateByIndex(state, wi * 5 + li)),
    ),
  )

export const getPuzzle = (date: Date | undefined) => {
  if (!date) {
    if (getParams().fastMode) {
      return {
        puzzleNumber: 'random',
        solvedWords: 'first,start,keeps,blast,shell'.split(','),
        jumbledWords: 'first,start,keeps,blast,lhesl'.split(','),
      }
    }
    const solvedWords = getRandomWords()
    const jumbledWords = getJumbledWords(solvedWords)
    return { puzzleNumber: 'random', solvedWords, jumbledWords }
  }

  date.setHours(0, 0, 0, 0)
  const day = Number(date) - Number(firstDay)
  const puzzleNumber = Math.floor(day / 1000 / 60 / 60 / 24) - 1
  const puzzle = PUZZLES[puzzleNumber]
  const solvedWords = puzzle[0].split(',')
  const jumbledWords = puzzle[1].split(',')
  const theme = puzzle[2]
  return { puzzleNumber, solvedWords, jumbledWords, theme }
}

export const applySave = (state: GameState) => {
  const save = localStorage.getItem(
    `${SAVE_KEY}-${state.solvedWords.join(',')}`,
  )
  if (save) {
    const [words, other] = save.split(':')
    const [moves, time] = other.split('-')
    state.jumbledWords = words.split(',')
    state.moveCount = +moves
    state.seconds = +time
  }
  return state
}

export const getIsComplete = ({
  solvedWords,
  jumbledWords,
}: {
  solvedWords: string[]
  jumbledWords: string[]
}) =>
  jumbledWords.every((w, wi) =>
    w.split('').every((c, ci) => c === solvedWords[wi][ci]),
  )

export const getParams = () => {
  const params = new URLSearchParams(window.location.search.replace('?', ''))
  const todayDateString = new Date(Date.now() - ONE_DAY).toISOString()
  const isEditMode = params.get('e') === ''
  const dateString = params.get('p') || todayDateString
  const solvedWords = params.get('s') || ''
  const jumbledWords = params.get('j') || ''
  const fastMode = params.get('f') === ''
  return { dateString, isEditMode, solvedWords, jumbledWords, fastMode }
}

export const saveGame = (state: GameState) => {
  localStorage.setItem(
    `${SAVE_KEY}-${state.solvedWords.join(',')}`,
    `${state.jumbledWords.join(',')}:${state.moveCount}-${state.seconds}`,
  )
}

export const getMessageFromMoveCount = (count: number) => {
  if (count === 8) return 'Perfect!'
  if (count === 9) return 'Amazing!'
  if (count === 10) return 'Great!'
  if (count === 11) return 'Good!'
  if (count === 12) return 'Not Bad!'
  return 'Done!'
}

// @ts-ignore
export const track = (...props) => {
  if (process.env.NODE_ENV === 'production') {
    // @ts-ignore
    window.gtag(...props)
  }
}

export const getStreakCountFromSaves = (state: GameState) => {
  let streak = true
  return PUZZLES.filter((_, i) => i < (state.puzzleNumber || 0))
    .reverse()
    .map(
      (p) =>
        localStorage.getItem(`${SAVE_KEY}-${p[0]}`)?.split(':')[0] === p[0],
    )
    .reduce((sum, b) => {
      if (!b) streak = false
      return streak ? sum + 1 : sum
    }, 0)
}
