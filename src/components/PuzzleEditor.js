import { useState } from 'react'
import * as utils from '../utils'

export const PuzzleEditor = ({ onJumble, jumbledWords }) => {
  const [solved, setSolved] = useState('')
  return (
    <div className="font-mono text-sm">
      <input
        value={solved}
        onChange={(e) => {
          setSolved(e.target.value.toLowerCase().slice(0, 29))
        }}
        className="text-black mt-12 p-1 w-[260px] mr-2"
      />
      <button
        className="w-[80px]"
        onClick={() => utils.validatePuzzleString(solved) && onJumble(solved)}
      >
        jumble
      </button>
      <input
        value={jumbledWords.join(',')}
        className="text-black mt-12 p-1 w-[260px] mr-2"
      />
      <button
        className="w-[80px]"
        onClick={() =>
          navigator.clipboard.writeText(
            `['${solved}', '${jumbledWords.join(',')}'],`,
          )
        }
      >
        copy
      </button>
    </div>
  )
}
