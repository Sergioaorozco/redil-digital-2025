import { YT_API_KEY, YT_CHANNEL_ID } from 'astro:env/server';

export type VideoDetails = { videoId: string; title: string };

// Global cache variables (server-side only)
let cachedVideo: VideoDetails | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const API_ERROR_SUGGESTION = 'Check your Google Cloud API key restrictions: Server-side requests must NOT be blocked by HTTP referrer restrictions. Use IP restrictions or leave them empty for testing.';

export async function getLatestVideo(): Promise<VideoDetails | null> {
  const now = Date.now();

  // Return cached result if valid
  if (cachedVideo && (now - lastFetchTime < CACHE_DURATION_MS)) {
    return cachedVideo;
  }

  // Fetch logic
  const apikey = YT_API_KEY;
  const channelId = YT_CHANNEL_ID;

  if (!apikey || !channelId) {
    console.error("Missing YouTube API Key or Channel ID in environment variables.");
    return null;
  }

  try {
    // --- Step 1: Fetch Channel Details to get Uploads Playlist ID ---
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${apikey}&id=${channelId}&part=contentDetails`
    );

    if (!channelResponse.ok) {
      await logYouTubeError(channelResponse, 'Error fetching channel info');
      return null;
    }

    const channelData = await channelResponse.json();
    const uploadPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadPlaylistId) {
      console.error('Could not find the "Uploads" playlist ID for this channel.');
      return null;
    }

    // --- Step 2: Fetch the Last Video from that Playlist ---
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=${uploadPlaylistId}&part=snippet&maxResults=1`
    );

    if (!playlistResponse.ok) {
      await logYouTubeError(playlistResponse, 'Error fetching playlist items');
      return null;
    }

    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      console.error("No videos found in the uploads playlist.");
      return null;
    }

    const { snippet: { resourceId: { videoId }, title } } = playlistData.items[0];

    const result: VideoDetails = {
      videoId,
      title
    };

    // Update Cache
    cachedVideo = result;
    lastFetchTime = now;

    return result;

  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return null;
  }
}

// Helper to log errors (simplified for non-throwing context)
async function logYouTubeError(response: Response, contextMessage: string) {
  const errorText = await response.text();
  let parsed;
  try { parsed = JSON.parse(errorText); } catch (e) { /* ignore */ }

  const isReferrerBlocked =
    response.status === 403 ||
    parsed?.error?.status === 'PERMISSION_DENIED' ||
    parsed?.error?.details?.some((d: any) => d?.reason === 'API_KEY_HTTP_REFERRER_BLOCKED');

  if (isReferrerBlocked) {
    console.error(`YouTube API 403 Forbidden. ${API_ERROR_SUGGESTION}`);
  } else {
    console.error(`${contextMessage}: ${parsed?.error?.message || errorText}`);
  }
}
