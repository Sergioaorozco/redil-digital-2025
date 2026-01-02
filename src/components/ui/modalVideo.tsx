import * as React from 'react';
import { XIcon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { actions } from 'astro:actions';
import { isModalOpened, isModalLoading } from '@/store';
import { Skeleton } from "@/components/ui/skeleton"


interface videoDetails {
  videoId?: string | null;
  title?: string | null;
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[300px] md:h-[500px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export const UIModalVideo: React.FC = () => {
  const isMounted = useStore(isModalOpened);
  const isLoading = useStore(isModalLoading);
  const closeModal = () => isModalOpened.set(false);
  const [videoInfo, setVideoInfo] = React.useState<videoDetails>({
    videoId: null,
    title: null
  });

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

    const fetchVideo = async () => {
      try {
        isModalLoading.set(true);
        const { data, error } = await actions.lastVideo();
        if(error) {
          throw new Error(`Error fetching video: ${error.message}`);
        }

        setVideoInfo({
          videoId: data?.videoId,
          title: data?.title
        })

      } catch (error) {
        console.error('Failed to fetch the last video:', error);
      } finally {
        isModalLoading.set(false);
      }
    }

    fetchVideo();

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


            {/* Modal Header */}
            <div className="flex justify-between w-full items-center gap-x-3">
              <button ref={closeBtnRef} onClick={closeModal} className="close-action cursor-behavior" aria-label="close-modal">
                <XIcon />
              </button>
              <h2 className="text-xs md:text-lg font-semibold">{videoInfo.title ?? 'Ultima Predicación'}</h2>
            </div>
            <div id="modal-body" className="h-full">
              <h3 id="redil-video-title" className="sr-only">Última Predicación</h3>

              {/* Loading State */}
              {isLoading && (
                <SkeletonCard />
              )}

              {/* Video Info Ready */}
              {videoInfo.videoId && !isModalLoading.value && (
                <iframe
                  width="100%"
                  src={`https://www.youtube.com/embed/${videoInfo.videoId}`}
                  title={videoInfo.title ?? 'Última Predicación'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="aspect-video"
                ></iframe>
              )}

              {/* Error State */}
              {!videoInfo.videoId && !isModalLoading.value && (
                <div className="text-center p-10 bg-neutral-900 rounded-lg">
                  <p>No se pudo cargar el video en este momento.</p>
                  <p className="text-xs text-neutral-400 mt-2">Por favor, inténtelo de nuevo más tarde.</p>
                </div>
              )}
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