import { useState } from 'react'
import { GameSettings, Stats } from '../types'
import { getHumanizedTime } from '../utils'
import { Modal } from './Modal'

interface StatProps {
  id: string
  num: number | string
  label: string
}

const Stat = ({ id, num, label }: StatProps) => (
  <div className="flex flex-col">
    <span id={`stat-${id}`} className="text-2xl font-semibold">
      {num}
    </span>
    <span className="text-xs mt-1 text-light-gray">{label}</span>
  </div>
)

interface StatsModalProps {
  open: boolean
  onClose: () => void
  isComplete: boolean
  moveCount: number
  seconds: number
  puzzleNumber: number | string | undefined
  boardState: string
  stats: Stats
  settings: GameSettings
}

export const StatsModal = ({
  open,
  onClose,
  isComplete,
  moveCount,
  seconds,
  puzzleNumber,
  stats,
  boardState,
  settings,
}: StatsModalProps) => {
  const [showMessage, setShowMessage] = useState(false)
  const puzzleName = puzzleNumber
  const time = getHumanizedTime(seconds)
  const avgTime = getHumanizedTime(stats.secondCount / (stats.winCount || 1))
  const avgMoves = (stats.moveCount / (stats.winCount || 1)).toFixed(2)
  let shareText = `quintessential.fun #${puzzleName}: ${moveCount} moves`

  if (settings.timer) shareText += ` in ${time}`
  shareText += `\n\n${boardState}`

  const onShare = () => {
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 2500)
    navigator.clipboard.writeText(shareText)

    // @ts-ignore
    gtag('event', 'share')
  }
  return (
    <Modal
      id="stats-modal"
      open={open}
      onClose={onClose}
      title="Statistics"
      className="flex flex-col items-center text-center"
    >
      <h2 className="mb-2">All Time</h2>

      <div className="flex space-x-8 mb-6">
        <Stat id="wins" num={stats.winCount} label="Wins" />
        <Stat id="avg-moves" num={avgMoves} label="Avg. Moves" />
        {settings.timer && (
          <Stat id="avg-time" num={avgTime} label="Avg. Time" />
        )}
      </div>

      {isComplete ? (
        <div id="last-game-stats">
          <h2 className="mb-2">Last Game</h2>

          <div className="flex space-x-8 mb-6">
            <Stat
              id="puzzle-num"
              num={puzzleName || 'random'}
              label="Puzzle #"
            />
            <Stat id="moves" num={moveCount} label="Moves" />
            {settings.timer && <Stat id="time" num={time} label="Time" />}
          </div>

          <button onClick={onShare}>{showMessage ? 'Copied!' : 'Share'}</button>
        </div>
      ) : (
        <></>
      )}
    </Modal>
  )
}
