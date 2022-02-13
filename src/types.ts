export interface Stats {
  winCount: number
  moveCount: number
  secondCount: number
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
