import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const noop = () => {};

const Modal = ({ open, onClose = noop, children }: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!open) return null;

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="omnix-fixed omnix-inset-0 omnix-flex omnix-items-center omnix-justify-center omnix-bg-black omnix-bg-opacity-50"
    >
      <div onClick={(e) => e.stopPropagation()} className="omnix-flex omnix-flex-col omnix-rounded-md omnix-bg-white">
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
