import { getHumanizedTime } from '../utils'

interface FooterProps {
  timer: boolean
  moveCount: number
  seconds: number
}

export const Footer = ({ timer, seconds, moveCount }: FooterProps) => (
  <div
    className={`flex ${
      timer ? 'justify-between' : 'justify-center'
    } px-2 mt-4 max-w-sm mx-auto`}
  >
    {timer && <span>{getHumanizedTime(seconds)}</span>}

    <span>
      {moveCount} Move{moveCount === 1 ? '' : 's'}
    </span>
  </div>
)
