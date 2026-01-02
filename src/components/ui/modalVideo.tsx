import * as React from 'react';
import { XIcon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { actions } from 'astro:actions';
import { isModalOpened } from '@/store';


export const UIModalVideo: React.FC = () => {
  const isMounted = useStore(isModalOpened);
  const closeModal = () => isModalOpened.set(false);

  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!isMounted) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    // focus close button for accessibility when modal opens
    closeBtnRef.current?.focus();

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMounted]);


  React.useEffect(() => {
    if(!isMounted) return;
    const actionResult = actions.lastVideo();
    console.log(actionResult);
  }, [isMounted])

  return (
    <>
      {isMounted && (
        <section
          role="dialog"
          aria-modal="true"
          className="px-5 text-white text-sm fixed top-0 min-w-full min-h-dvh z-50 flex justify-center items-center last-preech-modal"
        >
          <article
            id="modal-content"
            className="w-full min-md:w-1/2 p-5 rounded-md z-50 flex flex-col justify-between gap-8"
          >
            <div className="flex justify-between w-full items-center gap-x-3">
              <button ref={closeBtnRef} onClick={closeModal} className="close-action cursor-behavior" aria-label="close-modal">
                <XIcon />
              </button>
            </div>

            <div id="modal-body" className="h-full">
              {/* keep default video UI so helpers have elements to work with */}
              <h3 id="redil-video-title" className="sr-only">Última Predicación</h3>
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
  );
};

export default UIModalVideo;