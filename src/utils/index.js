import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import chunk from 'lodash/chunk'

const getJumbledWords = (solvedWords) => {
  // take solved words.  Swap 2 solved letter to unsolved positions
  // repeat 5 times?
  let jumble, numCorrect
  // TODO: more efficient puzzle generation
  // should just randomly swap tiles based on how many we want to leave alone
  do {
    jumble = chunk(shuffle(solvedWords.join('').split('')), 5).map((w) =>
      w.join(''),
    )
    numCorrect = jumble
      .map((word, wi) =>
        word.split('').filter((c, ci) => c === solvedWords[wi][ci]),
      )
      .flat().length
  } while (numCorrect !== 10)

  return jumble
}

const solved = shuffle([...WORDS]).slice(0, 5)
export const getInitialState = () => ({
  solvedWords: solved,
  jumbledWords: getJumbledWords(solved),
  activeIndex: null,
  moveCount: 0,
  isComplete: false,
})

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
  const color = correct ? '#528a4c' : almost ? '#a39035' : '#3a3a3c'

  return { index, active, color, correct }
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
  x: el?.offsetLeft,
  y: el?.offsetTop,
  color: getBackgroundColor(el),
  index: el?.dataset?.index ? +el.dataset.index : null,
})

export const getTileAtXY = (x, y, _el) =>
  document
    .elementsFromPoint(x, y)
    .find((el) => el.classList.contains('tile') && el !== _el)
