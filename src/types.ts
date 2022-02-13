export interface Stats {
  winCount: number
  moveCount: number
  secondCount: number
}

export interface GameState {
  date: Date | undefined
  solvedWords: string[]
  jumbledWords: string[]
  puzzleNumber: string | number | undefined
  moveCount: number
  seconds: number
  activeIndex: number | null
  isComplete: boolean
  stats: Stats
  isEditMode: boolean
  theme: string | undefined
  boardState: string
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
