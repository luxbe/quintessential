import shuffle from 'lodash/shuffle'
import chunk from 'lodash/chunk'

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

export const getTileStateByIndex = (
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
  const color = COLORS[state]

  return { index, active, color, state, correct }
}

export const getWordState = (state, index) =>
  new Array(5).fill('').map((_, i) => getTileStateByIndex(state, index * 5 + i))

export const performSwap = (words, i1, i2) => {
  const str = words.join('').split('')
  const temp = str[i1]
  str[i1] = str[i2]
  str[i2] = temp
  return chunk(str.join(''), 5).map((s) => s.join(''))
}

export const getTranslateXY = (element) => {
  if (!element) return { x: 0, y: 0 }
  const style = window.getComputedStyle(element)
  const matrix = new DOMMatrixReadOnly(style.transform)
  return { x: matrix.m41, y: matrix.m42 }
}

export const getTileElementData = (el) => ({
  x: el ? el.offsetLeft : null,
  y: el ? el.offsetTop : null,
  color: el ? getBackgroundColor(el) : null,
  index: el ? +el.dataset.index : null,
})

export const getTileElementAtXY = (x, y, _el) =>
  document
    .elementsFromPoint(x, y)
    .find((el) => el.classList.contains('tile') && el !== _el)

export const getHumanizedTime = (s) =>
  `${Math.floor(s / 60)}:${padNum(Math.floor(s % 60))}`

export const wordsToEmoji = (words) =>
  words.map((w) => w.map((l) => EMOJI[l.state]).join('')).join('\n')

export const validatePuzzleString = (s) => /(([a-z]){5},?){5}/.test(s)

const getBackgroundColor = (element) =>
  element
    ? window
        .getComputedStyle(element, null)
        .getPropertyValue('background-color')
    : null

const padNum = (n) => n.toString().padStart(2, '0')

const EMOJI = ['⬛', '🟩', '🟨']
const COLORS = ['#3a3a3c', '#528a4c', '#a39035']
