import { animated } from 'react-spring'
import { SpringState, TileState } from '../types'

interface WordProps {
  word: string
  index: number
  wordState: TileState[]
  bindGestures: (i: number) => {}
  springs: SpringState[]
  isEditMode: boolean
}

export const Word = ({
  word,
  index: wi,
  wordState,
  bindGestures,
  springs,
  isEditMode,
}: WordProps) => {
  return (
    <div className="word">
      {word.split('').map((letter, li) => {
        const index = wi * 5 + li
        const { state, active } = wordState[li]
        const disableClick = !isEditMode && state === 1
        const className =
          state === 1 ? 'correct' : state === 2 ? 'almost' : 'wrong'
        return (
          <animated.div
            {...(disableClick ? {} : bindGestures(index))}
            key={index}
            data-index={index}
            data-correct={state === 1}
            className={`tile ${active ? 'active' : ''} ${className}`}
            style={{
              ...springs[index],
              pointerEvents: disableClick ? 'none' : 'auto',
              cursor: disableClick ? 'auto' : 'pointer',
            }}
          >
            {letter}
          </animated.div>
        )
      })}
    </div>
  )
}
