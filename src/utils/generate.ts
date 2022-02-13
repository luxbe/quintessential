import { WORDS } from '../constants/puzzles'
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

// code used to assign randoms to weekdays and uniques to weekends
// let dailies = [...DAILIES]
// export const PUZZLES = [...RANDOMS]
// let i = 5
// while (dailies.length > 1) {
//   const one = dailies.shift()
//   const two = dailies.shift()
//   if (one && two) {
//     PUZZLES.splice(i, 0, one)
//     PUZZLES.splice(i + 1, 0, two)
//   }
//   i += 7
// }
