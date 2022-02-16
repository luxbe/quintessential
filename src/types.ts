import { SpringValue } from 'react-spring'

export interface Stats {
  winCount: number
  moveCount: number
  secondCount: number
  streakCount: number
  lastWinStamp: number | null
}

export interface GameState {
  solvedWords: string[]
  jumbledWords: string[]
  moveCount: number
  seconds: number
  activeIndex: number | null
  isComplete: boolean
  isEditMode: boolean
  boardState: string
  date?: Date
  puzzleNumber?: string | number
  theme?: string
}

export interface GameSettings {
  timer: boolean
}

export interface TileState {
  index: number
  active: boolean
  color: string
  state: number
  correct: boolean
}

export interface TileElementData {
  x: number
  y: number
  color: string
  index: number
}

export interface SpringState {
  x: SpringValue<number>
  y: SpringValue<number>
  backgroundColor: SpringValue<string>
}

export interface AppState {
  state: GameState
  stats: Stats
  settings: GameSettings
  message: string
  onRandomGame: () => void
  onEditPuzzle: (words: string) => void
  setStats: (v: any) => {}
  setSettings: (v: any) => {}
  setMessage: (v: any) => void
  bindGestures: (i: number) => {}
  springs: SpringState[]
}
