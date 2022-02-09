import classNames from 'classnames'
import { animated } from 'react-spring'

export const Word = ({
  word,
  index: wi,
  wordState,
  bindGestures,
  springs,
  isEditMode,
}) => {
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
