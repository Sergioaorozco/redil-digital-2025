import * as React from 'react';
import { XIcon } from 'lucide-react';

interface ModalProps {
  header?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ header, children, trigger }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const closeModal = () => setIsVisible(false);

  // FIXED: Correct implementation of the Escape key listener
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isVisible]); // Only re-run when visibility changes

  return (
    <>
      {/* Use a div or span instead of a button for the trigger 
        if your trigger content (like your Astro Image) contains other interactive elements.
      */}
      <div 
        onClick={() => setIsVisible(true)} 
        className="cursor-pointer h-full w-full"
        role="button"
        tabIndex={0}
      >
        {trigger}
      </div>

      {isVisible && (
        <section
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex justify-center items-center px-5"
        >
          <article
            id="modal-content"
            className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-6 rounded-xl z-[110] flex flex-col gap-6 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center w-full">
               <h2 className="text-lg font-bold text-white">{header}</h2>
              <button 
                onClick={closeModal} 
                className="p-1 hover:bg-neutral-800 rounded-lg transition-colors" 
                aria-label="close-modal"
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
          />
        </section>
      )}
    </>
  );
};