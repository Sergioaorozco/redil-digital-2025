    import gsap from "gsap";

  // Selectors
    const $modal = document.querySelector(".last-preech-modal") as HTMLElement;
    const $modalContent = document.querySelector("#modal-content") as HTMLElement;
    const $modalOverlay = document.querySelector("#modal-overlay") as HTMLElement;
    const $spinnerLoading = document.querySelector("#redil-spinner-loading") as HTMLElement;
    const $innerVideo = document.querySelector("#redil-video-player") as HTMLElement;
    const $innertitle = document.querySelector("#redil-video-title") as HTMLElement;

    export const fetchLastVideo = async () => {
      const apikey = import.meta.env.PUBLIC_YT_API_KEY;
      const channelId = import.meta.env.PUBLIC_YT_CHANNEL_ID;

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apikey}&part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1`
        );

        if(!response.ok) {
          throw new Error("Error al descargar videos");
        }
        const data = await response.json();
        const { id: {videoId}, snippet: {title}} = data.items[0];
        const videoDetails = {
          videoId: videoId,
          title: title
        }

        sessionStorage.setItem('ultimaPredica', JSON.stringify(videoDetails))
        return videoDetails;
      } catch (error) {
        throw error;
      }
    }

  export const openModalWithVideo = async () => {
    try {
      $spinnerLoading.dataset.loadingState = "true";
      let videoDetails;
      let checkSession = sessionStorage.getItem('ultimaPredica');
      videoDetails = checkSession !== null ? JSON.parse(checkSession) : await fetchLastVideo();

      const tl = gsap.timeline({ defaults: { ease: "power3.in", duration: 0.2 } });

      tl.fromTo(
        $modalOverlay,
        { opacity: 0 },
        { opacity: 1 },
      )

      tl.fromTo(
        $modalContent,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0 },
          "<0.1"
      )

      $modal.dataset.visible = "true";

      if (videoDetails && videoDetails.videoId && $innertitle) {
        $innertitle.innerHTML = videoDetails.title;
        $innerVideo?.setAttribute('src', `https://www.youtube.com/embed/${videoDetails.videoId}`);
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    } finally {
      $spinnerLoading.dataset.loadingState = "false";
    }
  }