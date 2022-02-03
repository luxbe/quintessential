import { useEffect, useRef, useState } from 'react'
import { WORDS } from './words'
import shuffle from 'lodash/shuffle'
import { chunk } from 'lodash'
const shuffled = shuffle([...WORDS])

const getRandomWords = (count = 5) => shuffled.slice(0, count)
const getJumbledWords = (words) =>
  shuffle([...words].join('')).reduce((arr, char, _i) => {
    const i = Math.floor(_i / 5)
    return [...arr.slice(0, i), (arr[i] || '') + char, ...arr.slice(i + 1)]
  }, [])

const useWindowEvent = (event, callback) => {
  useEffect(() => {
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }, [event, callback])
}

function App() {
  const [words] = useState(getRandomWords())
  const [jumbled, setJumbled] = useState(getJumbledWords(words))
  const startRef = useRef({ x: 0, y: 0 })
  const deltaRef = useRef({ x: 0, y: 0 })
  const [activeTile, setActiveTile] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    setComplete(
      jumbled.every((w, wi) =>
        w.split('').every((c, ci) => c === words[wi][ci]),
      ),
    )
  }, [jumbled, words])

  const onMouseDown = ({ clientX, clientY }) => {
    if (complete) return
    let tile = document.elementFromPoint(clientX, clientY)
    if (!tile.className.includes('tile')) return

    if (typeof activeTile === 'number') {
      const otherIndex = +tile.dataset.index
      if (activeTile === otherIndex) {
        setActiveTile(null)
      } else {
        setActiveTile(null)
        setMoveCount((mc) => mc + 1)
        setJumbled((jumbled) => {
          const str = jumbled.join('').split('')
          const a = str[activeTile]
          str[activeTile] = str[otherIndex]
          str[otherIndex] = a
          return chunk(str.join(''), 5).map((s) => s.join(''))
        })
      }
    } else {
      setActiveTile(+tile.dataset.index)
      startRef.current = { x: clientX, y: clientY }
      deltaRef.current = { x: clientX - tile.x, y: clientY - tile.y }
    }
  }

  useWindowEvent('pointerdown', onMouseDown)

  return (
    <div>
      <p>
        Try to get all 5 words correct. Green means the letter is correct.
        Yellow means it is in that word, but not that position in the word.
        White means the letter is not in that word. Click two letters to swap
        their position.
      </p>
      <p>Moves: {moveCount}</p>
      {complete && <b>You win!</b>}
      {jumbled.map((word, wordIndex) => (
        <div className="word" key={word}>
          <p style={{ marginRight: 8 }}>word {wordIndex + 1}:</p>
          {word.split('').map((l, i) => {
            const index = wordIndex * 5 + i
            const correct = words[wordIndex][i] === l
            const remainingLetters = words[wordIndex]
              .split('')
              .filter((c, ci) => jumbled[wordIndex][ci] !== c)
            const wrongSpot = !correct && remainingLetters.includes(l)
            return (
              <div
                key={i}
                data-index={index}
                className={`tile ${
                  activeTile === index
                    ? 'active'
                    : correct
                    ? 'correct'
                    : wrongSpot
                    ? 'wrong-spot'
                    : ''
                } `}
              >
                {l}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default App
