import { Modal } from './Modal'

export const HelpModal = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="How to play"
    className="text-left"
  >
    <p>Try to get each of the 5 horizontal words correct.</p>
    <p>Click/tap/drag two letters to swap them.</p>

    <p>
      <span className="font-bold text-green">Green</span> is correct.
    </p>
    <p>
      <span className="font-bold text-yellow">Yellow</span> is in correct word,
      but wrong position.
    </p>
    <p>
      <span className="font-bold text-light-gray">Gray</span> belongs in another
      word.
    </p>
  </Modal>
)
