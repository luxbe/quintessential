import * as utils from '../utils'

export const GameStats = ({ time, moveCount }) => (
  <div className="flex justify-between px-4 mt-5 mb-3 max-w-sm mx-auto">
    <span>{utils.getHumanizedTime(time)}</span>
    <span className="font-bold">FOODS</span>
    <span>
      {moveCount} Move{moveCount === 1 ? '' : 's'}
    </span>
  </div>
)
