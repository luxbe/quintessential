import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import { getJumbledWords } from '.'

const puzzles = []
let words = shuffle([...WORDS])
while (words.length >= 5) {
  const solvedWords = words.slice(0, 5)
  words = words.slice(5)
  const jumbledWords = getJumbledWords(solvedWords)
  puzzles.push([solvedWords.join(','), jumbledWords.join(',')])
}

console.log(...puzzles)
