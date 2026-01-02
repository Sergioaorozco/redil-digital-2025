import { defineAction, ActionError } from 'astro:actions';

type VideoDetails = { videoId: string; title: string };

const API_ERROR_SUGGESTION = 'Check your Google Cloud API key restrictions: Server-side requests must NOT be blocked by HTTP referrer restrictions. Use IP restrictions or leave them empty for testing.';

export const lastVideo = defineAction({
  handler: async () => {
    // 1. SECURITY FIX: Use private environment variables
    // Remove "PUBLIC_" so these are not exposed to the client browser.
    const apikey = import.meta.env.YT_API_KEY; 
    const channelId = import.meta.env.YT_CHANNEL_ID; // Channel ID is usually public safe

    if (!apikey || !channelId) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Missing YouTube API Key or Channel ID in environment variables."
      });
    }

    try {
      // --- Step 1: Fetch Channel Details to get Uploads Playlist ID ---
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${apikey}&id=${channelId}&part=contentDetails`
      );

      if (!channelResponse.ok) {
        await handleYouTubeError(channelResponse, 'Error fetching channel info');
      }

      const channelData = await channelResponse.json();
      const uploadPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadPlaylistId) {
        throw new Error('Could not find the "Uploads" playlist ID for this channel.');
      }

      // --- Step 2: Fetch the Last Video from that Playlist ---
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=${uploadPlaylistId}&part=snippet&maxResults=1`
      );

      if (!playlistResponse.ok) {
        await handleYouTubeError(playlistResponse, 'Error fetching playlist items');
      }

      const playlistData = await playlistResponse.json();

      if (!playlistData.items || playlistData.items.length === 0) {
        throw new Error("No videos found in the uploads playlist.");
      }

      const { snippet: { resourceId: { videoId }, title } } = playlistData.items[0];

      const videoDetails: VideoDetails = {
        videoId,
        title
      };

      return videoDetails;

    } catch (error) {
      // Re-throw ActionErrors (like 403s) so the client can handle them specifically
      if (error instanceof ActionError) throw error;
      
      console.error("YouTube Action Error:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  }
});

// Helper to handle YouTube API errors consistently
async function handleYouTubeError(response: Response, contextMessage: string) {
  const errorText = await response.text();
  let parsed;
  try { parsed = JSON.parse(errorText); } catch (e) { /* ignore */ }

  const isReferrerBlocked = 
    response.status === 403 || 
    parsed?.error?.status === 'PERMISSION_DENIED' || 
    parsed?.error?.details?.some((d: any) => d?.reason === 'API_KEY_HTTP_REFERRER_BLOCKED');

  if (isReferrerBlocked) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: `YouTube API 403 Forbidden. ${API_ERROR_SUGGESTION}`
    });
  }

  throw new Error(`${contextMessage}: ${parsed?.error?.message || errorText}`);
}