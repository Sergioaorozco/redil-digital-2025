import * as React from 'react';
import { XIcon } from 'lucide-react';
import { openModalWithVideo, closeModalWithVideo } from '@/utils/youtubeMethods';

interface UIModalVideoProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
  initialOpen?: boolean;
}

export const UIModalVideo: React.FC<UIModalVideoProps> = ({ header, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(initialOpen);
  const [isMounted, setIsMounted] = React.useState<boolean>(initialOpen);

  // refs instead of querying the DOM
  const modalRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLElement | null>(null);
  const overlayRef = React.useRef<HTMLElement | null>(null);
  const bodyRef = React.useRef<HTMLElement | null>(null);
  const titleRef = React.useRef<HTMLElement | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // Toggle visibility (single public state)
  const toggleModal = React.useCallback(() => setIsOpen(v => !v), []);

  // Listen for external event to open modal
  React.useEffect(() => {
    const onExternalOpen = () => setIsOpen(true);
    window.addEventListener('redil:open-last-preech', onExternalOpen as EventListener);

    // If the footer dispatched before this listener was attached, a short-lived
    // pending flag will be present in sessionStorage — handle it here.
    try {
      if (sessionStorage.getItem('redil:open-last-preech-pending')) {
        sessionStorage.removeItem('redil:open-last-preech-pending');
        setIsOpen(true);
      }
    } catch (e) {
      // ignore sessionStorage errors (private mode, SSR, etc.)
    }

    return () => window.removeEventListener('redil:open-last-preech', onExternalOpen as EventListener);
  }, []);

  // Manage mount/unmount and call GSAP helpers with refs (no selectors)
  React.useEffect(() => {
    let cancelled = false;
    if (isOpen) {
      setIsMounted(true);
      Promise.resolve().then(() => {
        if (!cancelled) {
          try {
            openModalWithVideo({
              modal: modalRef.current,
              content: contentRef.current,
              overlay: overlayRef.current,
              body: bodyRef.current,
              title: titleRef.current,
              iframe: iframeRef.current
            });
          } catch (err) {
            console.error(err);
          }
          document.body.style.overflow = 'hidden';
        }
      });
    } else if (isMounted) {
      closeModalWithVideo({
        content: contentRef.current,
        overlay: overlayRef.current,
        iframe: iframeRef.current
      }).finally(() => {
        if (!cancelled) {
          setIsMounted(false);
          document.body.style.overflow = '';
        }
      });
    }
    return () => { cancelled = true; };
  }, [isOpen]);

  // close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) toggleModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, toggleModal]);

  return (
    <>
      {isMounted && (
        <section
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className="px-5 text-white text-sm fixed top-0 min-w-full min-h-dvh z-50 flex justify-center items-center last-preech-modal"
        >
          <article
            id="modal-content"
            ref={contentRef}
            className="w-full min-md:w-1/2 p-5 rounded-md z-50 flex flex-col justify-between gap-8"
          >
            <div className="flex justify-between w-full items-center gap-x-3">
              {header}
              <button onClick={toggleModal} className="close-action cursor-behavior" aria-label="close-modal">
                <XIcon />
              </button>
            </div>

            <div id="modal-body" ref={bodyRef} className="h-full">
              {/* keep default video UI so helpers have elements to work with */}
              <h3 id="redil-video-title" ref={titleRef} className="sr-only">Última Predicación</h3>
              <iframe
                id="redil-video-player"
                ref={iframeRef}
                title="Última celebración"
                className="w-full aspect-video"
                // leave src empty; helpers will fill and preserve in dataset.src
                src={iframeRef.current?.dataset?.src || ''}
                loading="lazy"
              />
              {children}
            </div>
          </article>

          <div
            id="modal-overlay"
            ref={overlayRef}
            className="close-action absolute bg-neutral-800/85 min-w-full min-h-full top-0 left-0 right-0 backdrop-blur-sm"
            onClick={toggleModal}
          />
        </section>
      )}
    </>
  );
};

export default UIModalVideo;