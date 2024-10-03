type Props = {
  open: boolean;
  onClose: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
};

const noop = () => {};

const Modal = ({ open, onClose = noop, onClick = noop, children }: Props) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="omnix-fixed omnix-inset-0 omnix-z-[9999] omnix-flex omnix-items-center omnix-justify-center omnix-bg-black omnix-bg-opacity-50"
    >
      <div onClick={onClick} className="omnix-flex omnix-flex-col omnix-rounded-md omnix-bg-white">
        {children}
      </div>
    </div>
  );
};

const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="omnix-max-h-96 omnix-w-[700px] omnix-overflow-scroll">{children}</div>;
};

const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="omnix-rounded-t-md omnix-border-b omnix-p-4">{children}</div>;
};

const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="omnix-rounded-b-md omnix-border-t omnix-p-4">{children}</div>;
};

export { Modal, ModalContent, ModalHeader, ModalFooter };
