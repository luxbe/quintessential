import * as utils from '../utils'

export const GameStats = ({ time, theme, moveCount }) => (
  <div className="flex justify-between px-4 mt-5 mb-3 max-w-sm mx-auto">
    <span className="whitespace-nowrap w-[100px] text-left">
      {utils.getHumanizedTime(time)}
    </span>
    <span className="whitespace-nowrap w-[300px] font-bold">
      {theme ? `THEME: ${theme?.toUpperCase()}` : ''}
    </span>

    <span className="whitespace-nowrap w-[100px] text-right">
      {moveCount} Move{moveCount === 1 ? '' : 's'}
    </span>
  </div>
)
