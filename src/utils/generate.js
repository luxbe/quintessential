import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import { getJumbledWords } from '.'

const puzzles = []
for (let i = 0; i < 50; i++) {
  const solvedWords = shuffle([...WORDS]).slice(0, 5)
  const jumbledWords = getJumbledWords(solvedWords)
  puzzles.push([solvedWords.join(','), jumbledWords.join(',')])
}

console.log(puzzles)
