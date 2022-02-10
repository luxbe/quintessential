import { getHumanizedTime } from '../utils'

export const Footer = ({ timer, seconds, moveCount }) => (
  <div
    className={`flex ${
      timer ? 'justify-between' : 'justify-center'
    } px-4 mt-4 max-w-sm mx-auto`}
  >
    {timer && <span>{getHumanizedTime(seconds)}</span>}

    <span>
      {moveCount} Move{moveCount === 1 ? '' : 's'}
    </span>
  </div>
)
