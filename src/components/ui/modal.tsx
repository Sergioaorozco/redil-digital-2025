import * as React from 'react';
import { XIcon } from 'lucide-react';

interface ModalProps {
  header?: String;
  body?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ header, body }) => {
  const [isVisible, setIsVisible ] = React.useState(false);
  const closeModal = () => setIsVisible(false);

  return (
    <>
      {isVisible && (
        <section
          role="dialog"
          aria-modal="true"
          className="px-5 text-white text-sm fixed top-0 min-w-full min-h-dvh z-50 flex justify-center items-center"
        >
          <article
            id="modal-content"
            className="w-full min-md:w-1/2 p-5 rounded-md z-50 flex flex-col justify-between gap-8"
          >
            {/* Modal Header */}
            <div className="flex justify-between w-full items-center gap-x-3">
              <button onClick={closeModal} className="close-action cursor-behavior" aria-label="close-modal">
                <XIcon />
              </button>
              <h2 className="text-xs md:text-lg font-semibold">{header}</h2>
            </div>
            {/* Modal Body */}
            <div id="modal-body" className="h-full">
              {body}
            </div>
          </article>
          <div
            id="modal-overlay"
            className="close-action absolute bg-neutral-800/85 min-w-full min-h-full top-0 left-0 right-0 backdrop-blur-sm"
            onClick={closeModal}
          />
        </section>
      )}
    </>
  )
}