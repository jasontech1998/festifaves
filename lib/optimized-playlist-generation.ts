import kv from "./kv";
import {
  ArtistResult,
  SavedTrack,
  CreatePlaylist,
  CreatePlaylistLink,
} from "./actions";

export async function initiatePlaylistCreation(
  artists: ArtistResult[],
  token: string
) {
  const jobId = `playlist_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;
  const initialJobData = {
    status: "initiated",
    progress: 0,
    artists,
  };
  await kv.set(jobId, initialJobData);

  // Start the background job
  void processArtistsBatch(jobId, artists, token);

  return jobId;
}

async function processArtistsBatch(
  jobId: string,
  artists: ArtistResult[],
  token: string,
  startIndex = 0
) {
  const batchSize = 10; // Process 10 artists at a time
  const endIndex = Math.min(startIndex + batchSize, artists.length);
  const batch = artists.slice(startIndex, endIndex);

  try {
    const savedTracks = await CreatePlaylist(batch, token);

    // Update job progress
    const progress = Math.round((endIndex / artists.length) * 100);
    const currentJobData = await kv.get(jobId) as {
      status: string;
      progress: number;
      artists: ArtistResult[];
      savedTracks?:  SavedTrack[];
  };
    const currentJob = currentJobData;
    const updatedTracks = [...(currentJob.savedTracks || []), ...savedTracks];
    const updatedJobData = {
      ...currentJob,
      status: "processing",
      progress,
      savedTracks: updatedTracks,
    };
    await kv.set(jobId, updatedJobData);

    // If there are more artists to process, schedule the next batch
    if (endIndex < artists.length) {
      setTimeout(
        () => processArtistsBatch(jobId, artists, token, endIndex),
        1000
      );
    } else {
      // All artists processed, update job status to complete
      const completedJobData = {
        ...currentJob,
        status: "completed",
        savedTracks: updatedTracks,
      };
      await kv.set(jobId, completedJobData);
    }
  } catch (error) {
    console.error("Error processing artist batch:", error);
    const errorJobData = JSON.stringify({
      status: "failed",
      error: "Failed to process artists",
    });
    await kv.set(jobId, errorJobData);
  }
}

export async function getPlaylistStatus(jobId: string) {
  try {
    const jobData = await kv.get(jobId);
    console.log("jobData from kv: ", jobData);
    if (!jobData) {
      console.warn(`No data found for jobId: ${jobId}`);
      return null;
    }
    return jobData;
  } catch (error) {
    console.error(
      `Error retrieving or parsing job data for jobId ${jobId}:`,
      error
    );
    throw error;
  }
}

export async function createPlaylistLink(
  playlistName: string,
  savedTracks: SavedTrack[],
  userId: string
) {
  const trackUris = savedTracks.map((track) => `spotify:track:${track.id}`);
  return await CreatePlaylistLink(playlistName, trackUris, userId);
}
