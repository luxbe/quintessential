import { Stats } from '../types'

export const HELP_KEY = 'quint-help'
export const STATS_KEY = 'quintessential-stats'
export const SETTINGS_KEY = 'quint-settings'
export const SAVE_KEY = 'quintessential-save'
export const TIMER_MAX = 999
export const ONE_DAY = 1000 * 60 * 60 * 24
export const zero = { x: 0, y: 0 }
export const initialStats: Stats = { winCount: 0, moveCount: 0, secondCount: 0 }
export const springConfig = {
  x: 0,
  y: 0,
  backgroundColor: '#121212',
  config: {
    precision: 0.9,
    friction: 15,
    tension: 120,
    clamp: true,
  },
}
