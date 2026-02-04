import { useEffect } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    // 1) Disable page scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 2) Close on Escape
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
