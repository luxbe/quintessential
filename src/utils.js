import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import chunk from 'lodash/chunk'

const getJumbledWords = (solvedWords) => {
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

  return { index, active, color }
}

export const getTranslateXY = (element) => {
  const style = window.getComputedStyle(element)
  const matrix = new DOMMatrixReadOnly(style.transform)
  return { x: matrix.m41, y: matrix.m42 }
}

export const getBackgroundColor = (element) =>
  window.getComputedStyle(element, null).getPropertyValue('background-color')
