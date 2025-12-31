import { defineAction, ActionError } from 'astro:actions';

type VideoDetails = { videoId: string; title: string };

let cache: { data: VideoDetails | null; expires: number } = { data: null, expires: 0 };

export const lastVideo = defineAction({
  handler: async () => {
    try {
      const now = Date.now();
      if (cache.data && cache.expires > now) {
        return cache.data;
      }

      const apikey = import.meta.env.PRIVATE_YT_API_KEY;
      const channelId = import.meta.env.PUBLIC_YT_CHANNEL_ID;

      if (!apikey) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'YT_API_KEY not configured on server' });
      }

      // 1. Fetching channel list to get uploads playlist
      const channelList = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${apikey}&id=${channelId}&part=contentDetails`
      );

      if (!channelList.ok) {
        const body = await channelList.text();
        throw new ActionError({ code: 'BAD_GATEWAY', message: `Failed fetching channel info: ${body}` });
      }

      const channelData = await channelList.json();
      const uploadPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadPlaylistId) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'No upload playlist found' });
      }

      // 2. Get the last video from the uploads playlist
      const playlistItemsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=${uploadPlaylistId}&part=snippet&maxResults=1`
      );

      if (!playlistItemsResponse.ok) {
        const body = await playlistItemsResponse.text();
        throw new ActionError({ code: 'BAD_GATEWAY', message: `Failed fetching playlist items: ${body}` });
      }

      const playlistItemsData = await playlistItemsResponse.json();

      if (!playlistItemsData.items || playlistItemsData.items.length === 0) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'No videos found' });
      }

      const { snippet: { resourceId: { videoId }, title } } = playlistItemsData.items[0];
      const videoDetails = { videoId, title } as VideoDetails;

      // Cache for 5 minutes
      cache = { data: videoDetails, expires: Date.now() + 1000 * 60 * 5 };

      return videoDetails;
    } catch (err) {
      if (err instanceof ActionError) throw err;
      throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: String(err) });
    }
  }
});
