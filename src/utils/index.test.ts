import { getRandomWords } from '.'

jest.mock('i18next', () => {
  const originalModule = jest.requireActual('i18next')

  return {
    __esModule: true,
    ...originalModule,
    t: (key: string, ...args: string[]) => {
      if (key === 'game.words') {
        return [
          'word1',
          'word2',
          'word3',
          'word4',
          'word5',
          'word6',
          'word7',
          'word8',
          'word9',
          'word10',
        ];
      }
      throw new Error('Unimplemented')
    },
  }
})

describe('getJumbledWords', () => {
  it.todo('returns 5 strings')
  it.todo('contains the same letters as passed in')
  it.todo('leaves the correct number of letters solved')
})

describe('getTileStateByIndex', () => {
  it.todo('returns the correct state when all letters are correct')
  it.todo('returns the correct state when no letters are correct')
  it.todo('returns the correct state when some letters are correct case 1')
  it.todo('returns the correct state when some letters are correct case 2')
})

describe('getWordState', () => {
  it.todo('returns the letter state for the word')
})

describe('performSwap', () => {
  it.todo('swaps the indexes passed')
})

describe('getTranslateXY', () => {
  it.todo('returns the transform properties from the element')
})

describe('getTileElementData', () => {
  it.todo('returns data about the passed tile ement')
})

describe('getTileElementAtXY', () => {
  it.todo('returns a tile element found at the passed coordinates')
})

describe('getHumanizedTime', () => {
  it.todo('returns a humanized time string')
})

describe('validatePuzzleString', () => {
  it.todo('ensures that a given string is a valid puzzle')
})

describe('getRandomWords', () => {
  it('returns 5 random words', () => {
    const words = getRandomWords()
    expect(words.length).toBe(5)
  })
})

describe('getBoardState', () => {
  it.todo('converts letter state to an emoji string')
})

describe('getPuzzle', () => {
  it.todo('returns a puzzle based on the passed date')
})

describe('applySave', () => {
  it.todo('applies data in localstorage to game state')
})

describe('getParams', () => {
  it.todo('returns applicable uri params')
})

describe('saveGame', () => {
  it.todo('saves game')
})
