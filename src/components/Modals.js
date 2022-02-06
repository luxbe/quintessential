import { CloseIcon } from './Icons'

export const HelpModal = ({ open, onClose }) => (
  <div className={`modal ${open ? 'open' : ''}`}>
    <header>
      <CloseIcon onClick={onClose} />

      <h1>HELP</h1>

      <div style={{ width: 25 }} />
    </header>
    <div style={{ padding: '0 12px' }}>
      <p>Try to get all 5 words correct.</p>
      <p>
        <span className="green">Green</span> means the letter is correct.
      </p>
      <p>
        <span className="yellow">Yellow</span> means it is in that word, but not
        that position in the word.
      </p>
      <p>
        <span className="gray">Gray</span> means the letter is not in that word.
      </p>
      <p>Click/tap/drag two letters to swap their position.</p>
    </div>
  </div>
)

export const SettingsModal = ({ open, onClose }) => (
  <div className={`modal ${open ? 'open' : ''}`}>
    <header>
      <div style={{ width: 25 }} />

      <h1>SETTINGS</h1>

      <CloseIcon onClick={onClose} />
    </header>
    <div style={{ padding: '0 12px' }}></div>
  </div>
)
