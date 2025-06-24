    import gsap from "gsap";

    export const fetchLastVideo = async () => {
      const $spinnerLoading = document.querySelector(".redil-spinner-loading") as HTMLElement;
      const apikey = import.meta.env.PUBLIC_YT_API_KEY;
      const channelId = import.meta.env.PUBLIC_YT_CHANNEL_ID;

      try {
        $spinnerLoading.dataset.loadingState = "true";
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apikey}&part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1`
        );

        if(!response.ok) {
          const errorBody = await response.text(); // Try to get the raw error body
          throw new Error(errorBody);
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
      } finally {
        if($spinnerLoading){
          $spinnerLoading.dataset.loadingState = "false";
        }
      }
    }

  export const openModalWithVideo = async () => {
  // Selectors
    const $modal = document.querySelector(".last-preech-modal") as HTMLElement;
    const $modalContent = document.querySelector("#modal-content") as HTMLElement;
    const $modalBody = document.querySelector("#modal-body") as HTMLElement;
    const $modalOverlay = document.querySelector("#modal-overlay") as HTMLElement;
    const $innerVideo = document.querySelector("#redil-video-player") as HTMLElement;
    const $innertitle = document.querySelector("#redil-video-title") as HTMLElement;
    
    try {
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

      let checkSession = sessionStorage.getItem('ultimaPredica');
      let videoDetails = checkSession !== null ? JSON.parse(checkSession) : await fetchLastVideo();

      if (videoDetails && videoDetails.videoId && $innertitle) {
        $innertitle.innerHTML = videoDetails.title;
        $innerVideo?.setAttribute('src', `https://www.youtube.com/embed/${videoDetails.videoId}`);
      }
    } catch (error) {
      $innertitle.innerHTML = 'Última Predicación'
      $modalBody.innerHTML = 'Un error ocurrio al cargar este video.'
    }
  }