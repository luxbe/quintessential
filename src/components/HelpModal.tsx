import { Modal } from './Modal'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

export const HelpModal = ({ open, onClose }: HelpModalProps) => (
  <Modal
    id="help-modal"
    open={open}
    onClose={onClose}
    title="How to play"
    className="text-left"
  >
    <p>Try to get each of the 5 horizontal words correct.</p>
    <p>Click/tap/drag two letters to swap them.</p>

    <video className="mx-auto max-h-[8rem]" autoPlay loop muted playsInline>
      <source src="/help.mp4" type="video/mp4" />
    </video>
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
