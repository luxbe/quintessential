import { t } from 'i18next'
import { useState, ReactNode, useEffect } from 'react'
import { GameSettings, Stats } from '../types'
import { getHumanizedTime, track } from '../utils'
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
  puzzleTheme: string | undefined
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
  puzzleTheme,
}: StatsModalProps) => {
  const [showMessage, setShowMessage] = useState(false)
  const puzzleName = puzzleNumber
  const time = getHumanizedTime(seconds)
  const avgTime = getHumanizedTime(stats.secondCount / (stats.winCount || 1))
  const avgMoves = (stats.moveCount / (stats.winCount || 1)).toFixed(2)
  let shareText = `quintessential.fun #${puzzleName} (${puzzleTheme}): ${moveCount} moves`

  if (settings.timer) shareText += ` in ${time}`
  shareText += `\n\n${boardState}`

  const onShare = () => {
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 2500)
    navigator.clipboard.writeText(shareText)
    track('event', 'share')
  }
  return (
    <Modal
      id="stats-modal"
      open={open}
      onClose={onClose}
      title={t("stats.title")}
      className="flex flex-col items-center text-center"
    >
      <StatsSection heading={t("stats.allTime.heading")}>
        <div className="flex justify-center space-x-8">
          <Stat id="wins" num={stats.winCount} label={t("stats.allTime.wins")} />
          <Stat id="avg-moves" num={avgMoves} label={t("stats.allTime.avgMoves")} />
          {settings.timer && (
            <Stat id="avg-time" num={avgTime} label={t("stats.allTime.avgTime")} />
          )}
        </div>
      </StatsSection>

      <StatsSection heading={t("stats.nextGame.heading")}>
        <div className="flex justify-center space-x-8">
          <Stat id="streak" num={stats.streakCount} label={t("stats.nextGame.streak")} />
          <Countdown />
        </div>
      </StatsSection>

      {isComplete ? (
        <StatsSection heading={t("stats.lastGame.heading")}>
          <>
            <div id="last-game-stats" className="flex space-x-8 mb-4">
              <Stat
                id="puzzle-num"
                num={puzzleName || 'random'}
                label={t("stats.lastGame.puzzleNr")}
              />
              <Stat id="moves" num={moveCount} label={t("stats.lastGame.moves")} />
              {settings.timer && <Stat id="time" num={time} label={t("stats.lastGame.time")} />}
            </div>

            <button onClick={onShare}>
              {showMessage ? t('stats.copied'):t('stats.share')}
            </button>
          </>
        </StatsSection>
      ) : (
        <></>
      )}
    </Modal>
  )
}

const StatsSection = ({
  heading,
  children,
}: {
  heading: string
  children: ReactNode
}) => (
  <div className="mb-6">
    <h2>{heading}</h2>

    {children}
  </div>
)

const Countdown = () => {
  const [, forceUpdate] = useState(0)
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59)
  const secondsToMidnight = (+endOfDay - Date.now()) / 1000
  const hours = Math.floor(secondsToMidnight / 60 / 60)
  const minutes = Math.floor(secondsToMidnight / 60 - hours * 60)

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(Date.now()), 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold">
        {`${hours}`}h {`${minutes}`}m
      </span>
      <span className="text-xs mt-1 text-light-gray">{t('stats.countdown')}</span>
    </div>
  )
}
