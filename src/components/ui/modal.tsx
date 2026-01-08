import * as React from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';

interface ModalProps {
  header?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ header, children, trigger }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const modalRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsMounted(true);
    // Small delay to trigger animation
    setTimeout(() => setIsAnimating(true), 10);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsAnimating(false);
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setIsVisible(false);
      setIsMounted(false);
      // Return focus to trigger element
      triggerRef.current?.focus();
    }, 200);
  };

  // Escape key listener
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        closeModal();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isVisible]);

  // Body scroll lock
  React.useEffect(() => {
    if (isVisible) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isVisible]);

  // Focus trap
  React.useEffect(() => {
    if (!isVisible || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Auto-focus first element
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey as any);

    return () => {
      modal.removeEventListener('keydown', handleTabKey as any);
    };
  }, [isVisible]);

  const modalContent = isMounted ? (
    <section
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-header"
      className="fixed inset-0 z-[100] flex justify-center items-center px-5"
      style={{
        transition: 'opacity 200ms ease-in-out',
        opacity: isAnimating ? 1 : 0,
      }}
    >
      <article
        id="modal-content"
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-6 rounded-xl z-[110] flex flex-col gap-6 shadow-2xl"
        style={{
          transition: 'transform 200ms ease-out, opacity 200ms ease-out',
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          opacity: isAnimating ? 1 : 0,
        }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center w-full">
          <h2 id="modal-header" className="text-lg font-bold text-white">
            {header}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="text-white" size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div id="modal-body" className="text-neutral-300">
          {children}
        </div>
      </article>

      {/* Modal Overlay */}
      <div
        id="modal-overlay"
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
        onClick={closeModal}
        style={{
          transition: 'opacity 200ms ease-in-out',
          opacity: isAnimating ? 1 : 0,
        }}
      />
    </section>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        className="cursor-pointer h-full w-full"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
      >
        {trigger}
      </div>

      {/* Portal rendering - modal will be rendered at document.body level */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};