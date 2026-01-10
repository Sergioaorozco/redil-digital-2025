import * as React from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';

// ============================================
// Types
// ============================================
import type { ModalProps } from '@/components/types/modal';

// ============================================
// Custom Hooks
// ============================================

/**
 * Locks body scroll and compensates for scrollbar width to prevent layout shift
 */
const useScrollLock = (isLocked: boolean) => {
  React.useEffect(() => {
    if (!isLocked) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, [isLocked]);
};

/**
 * Traps focus within modal for accessibility
 */
const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) => {
  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () => {
      return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      );
    };

    // Focus first element on mount
    const focusables = getFocusableElements();
    focusables[0]?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        if (activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive, containerRef]);
};

/**
 * Handles Escape key to close modal
 */
const useEscapeKey = (isActive: boolean, onEscape: () => void) => {
  React.useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isActive, onEscape]);
};

// ============================================
// Main Component
// ============================================

export const Modal: React.FC<ModalProps> = ({ header, trigger, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const modalRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleOpen = React.useCallback(() => {
    setIsMounted(true);
    setIsVisible(true);
    // Use RAF for smoother animation timing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true));
    });
  }, []);

  const handleClose = React.useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setIsMounted(false);
      triggerRef.current?.focus();
    }, 200); // Matches CSS transition duration
  }, []);

  // Apply hooks
  useScrollLock(isVisible);
  useFocusTrap(isVisible, modalRef);
  useEscapeKey(isVisible, handleClose);

  const renderModal = () => {
    if (!isMounted) return null;

    return createPortal(
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
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <article
          id="modal-content"
          className="relative w-full max-w-2xl bg-neutral-950 p-6 rounded-xl z-[110] flex flex-col gap-6 shadow-2xl"
          style={{
            transition: 'transform 200ms ease-out, opacity 200ms ease-out',
            transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
            opacity: isAnimating ? 1 : 0,
          }}
        >
          <header className="flex justify-between gap-x-3 items-center w-full">
            <h2 id="modal-header" className="text-lg mr-5 font-bold text-neutral-200">
              {header}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-neutral-600 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <XIcon className="text-white" size={24} />
            </button>
          </header>

          <div id="modal-body" className="text-neutral-300">
            {children}
          </div>
        </article>
      </section>,
      document.body
    );
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        className="cursor-pointer h-full w-full"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isVisible}
      >
        {trigger}
      </div>

      {typeof document !== 'undefined' && renderModal()}
    </>
  );
};