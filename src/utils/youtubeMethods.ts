import gsap from "gsap";

type ModalEls = {
  modal?: HTMLElement | null;
  content?: HTMLElement | null;
  overlay?: HTMLElement | null;
  body?: HTMLElement | null;
  iframe?: HTMLIFrameElement | null;
  title?: HTMLElement | null;
};

export const fetchLastVideo = async () => {
  const $spinnerLoading = document.querySelector(".redil-spinner-loading") as HTMLElement;
  const apikey = import.meta.env.PRIVATE_YT_API_KEY;
  const channelId = import.meta.env.PUBLIC_YT_CHANNEL_ID;

  try {
    $spinnerLoading.dataset.loadingState = "true";

    // 1. Fetching channelList
    const channelList = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${apikey}&id=${channelId}&part=contentDetails`
    )

    if( !channelList.ok) {
      const errorBody = await channelList.text();
      throw new Error(`Error Buscando informacion del canal: ${errorBody}`);
    }

    // 2. Getting the upload playlist id
    const channelData = await channelList.json();
    const uploadPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

    if(!uploadPlaylistId) {
      throw new Error('No fue posible encontrar un playlist ID');
    }

    // 3. Get the last video from Youtube using Playlist Items endpoint
    const playlistItemsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=${uploadPlaylistId}&part=snippet&maxResults=1`
    );

    if(!playlistItemsResponse.ok) {
      throw new Error('Error consultado informacion de la playlist');
    }

    const playlistItemsData = await playlistItemsResponse.json();

    if (!playlistItemsData.items || playlistItemsData.items.length === 0) {
      throw new Error("No se encontraron videos en la playlist seleccionada");
    }

    const { snippet: { resourceId: { videoId }, title } } = playlistItemsData.items[0];

    const videoDetails = {
      videoId: videoId,
      title: title
    };

    sessionStorage.setItem('ultimaPredica', JSON.stringify(videoDetails))
    return videoDetails;
  } catch (error) {
    throw error;
  } finally {
    if($spinnerLoading){
      $spinnerLoading.dataset.loadingState = "false";
    }
  }
}

export const openModalWithVideo = async (els: ModalEls = {}) => {
  const { modal, content, overlay, body, iframe, title } = els;
  if (!modal || !content || !overlay) {
    console.warn("[youtubeMethods] missing elements for openModalWithVideo");
    return;
  }

  try {
    gsap.killTweensOf([overlay, content]);
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.24 } });
    tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 });
    tl.fromTo(content, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "<0.06");
    modal.dataset.visible = "true";
  } catch (err) {
    console.error("[youtubeMethods] GSAP open failed:", err);
    // fallback styles to make modal visible
    overlay.style.opacity = "1";
    content.style.opacity = "1";
    content.style.transform = "none";
  }

  try {
    const checkSession = sessionStorage.getItem("ultimaPredica");
    const videoDetails = checkSession ? JSON.parse(checkSession) : await fetchLastVideo();
    if (videoDetails?.videoId) {
      if (title) title.textContent = videoDetails.title || "Última Predicación";
      if (iframe) {
        const base = iframe.dataset.src || iframe.src || `https://www.youtube.com/embed/${videoDetails.videoId}`;
        iframe.src = base.includes("autoplay=1") ? base : `${base}${base.includes("?") ? "&" : "?"}autoplay=1`;
      }
    }
  } catch (err) {
    console.error("[youtubeMethods] failed to load video details:", err);
    if (title) title.textContent = "Última Predicación";
    if (body) body.textContent = "Un error ocurrio al cargar este video.";
  }
};

export const closeModalWithVideo = (els: Pick<ModalEls, 'content' | 'overlay' | 'iframe'> = {}): Promise<void> => {
  const { content, overlay, iframe } = els;
  return new Promise((resolve) => {
    if (!content || !overlay) {
      console.warn("[youtubeMethods] missing elements for closeModalWithVideo, resolving");
      return resolve();
    }

    try {
      gsap.killTweensOf([overlay, content]);
      const tl = gsap.timeline({ defaults: { ease: "power3.in", duration: 0.22 } });
      tl.to(content, { y: 20, autoAlpha: 0 });
      tl.to(
        overlay,
        {
          autoAlpha: 0,
          onComplete: () => {
            if (iframe) {
              try {
                iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "stopVideo", args: [] }), "*");
              } catch (e) {}
              if (iframe.src) {
                iframe.dataset.src = iframe.src;
                iframe.src = "";
              }
            }
            resolve();
          }
        },
        "<0.02"
      );
    } catch (err) {
      console.error("[youtubeMethods] close animation failed:", err);
      if (iframe && iframe.src) {
        try {
          iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "stopVideo", args: [] }), "*");
        } catch (e) {}
        iframe.dataset.src = iframe.src;
        iframe.src = "";
      }
      resolve();
    }
  });
};