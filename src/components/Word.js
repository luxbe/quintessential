import classNames from 'classnames'
import { animated } from 'react-spring'

export const Word = ({ word, index: wi, wordState, bind, springs }) => {
  return (
    <div className="word">
      {word.split('').map((letter, li) => {
        const index = wi * 5 + li
        return (
          <animated.div
            {...bind(index)}
            key={index}
            data-index={index}
            className={`tile ${classNames(wordState[li])}`}
            style={springs[index]}
          >
            {letter}
          </animated.div>
        )
      })}
    </div>
  )
}
