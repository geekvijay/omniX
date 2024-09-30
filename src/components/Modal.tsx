
type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const noop = () => {};

const Modal = ({ open, onClose = noop, children }: Props) => {
  if (!open) return null;
  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal;
