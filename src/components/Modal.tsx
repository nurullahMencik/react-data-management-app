import React from "react";
import type { ReactNode } from "react";

import "../styles/Modal.css"; // CSS dosyasını buraya aktarıyoruz

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;