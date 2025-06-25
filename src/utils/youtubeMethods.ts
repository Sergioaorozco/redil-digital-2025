    import gsap from "gsap";

    export const fetchLastVideo = async () => {
      const $spinnerLoading = document.querySelector(".redil-spinner-loading") as HTMLElement;
      const apikey = import.meta.env.PUBLIC_YT_API_KEY;
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
      console.error(error);
      $innertitle.innerHTML = 'Última Predicación'
      $modalBody.innerHTML = 'Un error ocurrio al cargar este video.'
    }
  }