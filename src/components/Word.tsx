import classNames from 'classnames'
import { animated, SpringValue } from 'react-spring'
import { TileState } from '../types'

interface SpringState {
  x: SpringValue<number>
  y: SpringValue<number>
  backgroundColor: SpringValue<string>
}

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
        const disableClick = !isEditMode && wordState[li].correct
        return (
          <animated.div
            {...(disableClick ? {} : bindGestures(index))}
            key={index}
            data-index={index}
            data-correct={wordState[li].correct}
            className={`tile ${classNames(wordState[li])}`}
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
