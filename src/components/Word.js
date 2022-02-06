import classNames from 'classnames'
import { animated } from 'react-spring'

export const Word = ({ word, index: wi, wordState, bindGestures, springs }) => {
  return (
    <div className="word">
      {word.split('').map((letter, li) => {
        const index = wi * 5 + li
        return (
          <animated.div
            {...(wordState[li].correct ? {} : bindGestures(index))}
            key={index}
            data-index={index}
            data-correct={wordState[li].correct}
            className={`tile ${classNames(wordState[li])}`}
            style={{
              ...springs[index],
              pointerEvents: wordState[li].correct ? 'none' : 'auto',
              cursor: wordState[li].correct ? 'auto' : 'pointer',
            }}
          >
            {letter}
          </animated.div>
        )
      })}
    </div>
  )
}
