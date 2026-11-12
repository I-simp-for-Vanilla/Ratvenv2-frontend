import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({ open, title, text, confirmLabel = 'Supprimer', danger = true, onConfirm, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose} width={440}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Annuler</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
      </>}>
      <p className="muted">{text}</p>
    </Modal>
  );
}
