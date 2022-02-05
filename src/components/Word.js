import classNames from 'classnames'

export const Word = ({ word, index: wi, wordState }) => (
  <div className="word">
    <p style={{ marginRight: 8 }}>word {wi + 1}:</p>

    {word.split('').map((letter, li) => (
      <div
        key={wi * 5 + li}
        data-index={wi * 5 + li}
        className={`tile ${classNames(wordState[li])}`}
      >
        {letter}
      </div>
    ))}
  </div>
)
