import { getBoardState } from '.'
import getInitialState from './getInitialState'

// TODO: test edit mode better?

const solvedWords = ['reply', 'handy', 'taken', 'taboo', 'smote']
const jumbledWords = ['snbho', 'ldnat', 'yakoe', 'tapyo', 'rmete']
jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index')
  return {
    __esModule: true,
    ...originalModule,
    getJumbledWords: () => jumbledWords,
    getPuzzle: (date: Date) =>
      date
        ? originalModule.getPuzzle(date)
        : { puzzleNumber: 'random', solvedWords, jumbledWords },
  }
})

const expectedInitialState = {
  puzzleNumber: 'random',
  activeIndex: null,
  isEditMode: false,
  moveCount: 0,
  seconds: 0,
  isComplete: false,
}

it('loads a specific date string', () => {
  const date = new Date('2022-02-13')
  date.setHours(0, 0, 0, 0)
  const result = getInitialState({ dateString: '2022-02-12' })
  expect(result).toEqual({
    ...expectedInitialState,
    date,
    puzzleNumber: 5,
    theme: 'food',
    jumbledWords: ['sucsc', 'uaudn', 'pabae', 'zcros', 'crizt'],
    solvedWords: ['pizza', 'bacon', 'sauce', 'curds', 'crust'],
    boardState: getBoardState(result),
  })
})

it('allows puzzle editing', () => {
  const solvedWords = ['koala', 'steer', 'horse', 'lemur', 'tiger']
  const result = getInitialState({ solvedWords })
  expect(result).toEqual({
    ...expectedInitialState,
    date: undefined,
    solvedWords,
    jumbledWords,
    boardState: getBoardState(result),
  })
})

it('generates a random puzzle', () => {
  const result = getInitialState()
  expect(result).toEqual({
    ...expectedInitialState,
    date: undefined,
    solvedWords,
    jumbledWords,
    boardState: getBoardState(result),
  })
})
