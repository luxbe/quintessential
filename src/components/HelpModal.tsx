import { t } from 'i18next'
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
    title={t("help.title")}
    className="text-left"
  >
    <p>{t("help.message1")}</p>
    <p>{t("help.message2")}</p>

    <video className="mx-auto max-h-[8rem]" autoPlay loop muted playsInline>
      <source src="/help.mp4" type="video/mp4" />
    </video>
    <p>
      <span className="font-bold text-green">{t("help.correct.name")}</span> {t("help.correct.message")}
    </p>
    <p>
      <span className="font-bold text-yellow">{t("help.almost.name")}</span> {t("help.almost.message")}
    </p>
    <p>
      <span className="font-bold text-light-gray">{t("help.wrong.name")}</span> {t("help.wrong.message")}
    </p>
  </Modal>
)
