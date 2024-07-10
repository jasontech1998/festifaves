"use server";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import { cache } from "react";

interface SpotifyUserProfile {
  display_name: string;
  email: string;
  images: { url: string }[];
  id: string;
}

const profileInitialState = {
  display_name: "",
  email: "",
  images: [{ url: "" }],
  id: "",
};

export type ArtistResult = {
  name: string;
  id: string;
  genres?: string[];
  profileUrl: string;
  imageUrl: string;
};

type SpotifyArtist = {
  id: string;
  name: string;
  genres?: string[];
  external_urls: {
    spotify: string;
  };
  images: Array<{ url: string; height: number; width: number }>;
};

export interface SavedTrack {
  name: string;
  id: string;
  artistName: string;
  albumName: string;
}

export async function GetProfile(): Promise<SpotifyUserProfile> {
  const session = await auth();
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    return data as SpotifyUserProfile;
  } catch (error) {
    console.error("An error occurred while fetching profile:", error);
    return profileInitialState;
  }
}

export async function CreatePlaylistLink(
  playlistName: string,
  savedTracks: string[],
  userId: string
) {
  const session = await auth();
  if (!session?.token) {
    throw new Error("No valid session token found");
  }

  try {
    // Create the playlist
    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: "Created with FestiFaves",
          public: false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      const errorData = await createPlaylistResponse.json();
      console.error("Playlist creation error:", errorData);
      throw new Error(`Failed to create playlist: ${createPlaylistResponse.status} ${createPlaylistResponse.statusText}`);
    }

    const playlistData = await createPlaylistResponse.json();
    const { id: playlistId } = playlistData;
    const playlistUrl = playlistData.external_urls.spotify;

    // Add tracks in batches
    const batchSize = 100; // Spotify allows up to 100 tracks per request
    for (let i = 0; i < savedTracks.length; i += batchSize) {
      const batch = savedTracks.slice(i, i + batchSize);
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: batch,
          }),
        }
      );

      if (!addTracksResponse.ok) {
        const errorData = await addTracksResponse.json();
        console.error("Add tracks error:", errorData);
        throw new Error(`Failed to add tracks to the playlist: ${addTracksResponse.status} ${addTracksResponse.statusText}`);
      }
    }

    return playlistUrl;
  } catch (error) {
    console.error("Error in CreatePlaylistLink:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

export const CreatePlaylist = cache(
  async (artists: ArtistResult[], token: string): Promise<SavedTrack[]> => {
    noStore();
    const session = await auth();

    if (!session?.token) {
      throw new Error("No valid Spotify session found");
    }

    const savedTracks: SavedTrack[] = [];
    const limit = 50; // Maximum allowed by Spotify API

    for (const artist of artists) {
      try {
        // Get the artist's top tracks
        const topTracksResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
          {
            headers: { Authorization: `Bearer ${session.token}` },
          }
        );

        if (!topTracksResponse.ok) {
          throw new Error(`HTTP error! status: ${topTracksResponse.status}`);
        }

        const topTracksData = await topTracksResponse.json();
        const topTrackIds = topTracksData.tracks.map(
          (track: { id: string }) => track.id
        );

        // Check if top tracks are saved in user's library
        const savedResponse = await fetch(
          `https://api.spotify.com/v1/me/tracks/contains?ids=${topTrackIds.join(
            ","
          )}`,
          {
            headers: { Authorization: `Bearer ${session.token}` },
          }
        );

        if (!savedResponse.ok) {
          throw new Error(`HTTP error! status: ${savedResponse.status}`);
        }

        const savedData = await savedResponse.json();

        topTracksData.tracks.forEach(
          (
            track: { id: string; name: string; album: { name: string } },
            index: number
          ) => {
            if (savedData[index]) {
              savedTracks.push({
                name: track.name,
                id: track.id,
                artistName: artist.name,
                albumName: track.album.name,
              });
            }
          }
        );

        // If we haven't found any saved tracks in the top tracks, check the latest album
        if (!savedTracks.some((track) => track.artistName === artist.name)) {
          const albumsResponse = await fetch(
            `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&limit=1`,
            {
              headers: { Authorization: `Bearer ${session.token}` },
            }
          );

          if (albumsResponse.ok) {
            const albumsData = await albumsResponse.json();
            if (albumsData.items.length > 0) {
              const latestAlbum = albumsData.items[0];
              const tracksResponse = await fetch(
                `https://api.spotify.com/v1/albums/${latestAlbum.id}/tracks?limit=${limit}`,
                {
                  headers: { Authorization: `Bearer ${session.token}` },
                }
              );

              if (tracksResponse.ok) {
                const tracksData = await tracksResponse.json();
                const trackIds = tracksData.items.map(
                  (track: { id: string }) => track.id
                );
                const albumSavedResponse = await fetch(
                  `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.join(
                    ","
                  )}`,
                  {
                    headers: { Authorization: `Bearer ${session.token}` },
                  }
                );

                if (albumSavedResponse.ok) {
                  const albumSavedData = await albumSavedResponse.json();
                  tracksData.items.forEach(
                    (track: { id: string; name: string }, index: number) => {
                      if (albumSavedData[index]) {
                        savedTracks.push({
                          name: track.name,
                          id: track.id,
                          artistName: artist.name,
                          albumName: latestAlbum.name,
                        });
                      }
                    }
                  );
                }
              }
            }
          }
        }

        // If both of these didn't work, then just add the top 2 songs from the artist
        if (!savedTracks.some((track) => track.artistName === artist.name)) {
          topTracksData.tracks
            .slice(0, 2)
            .forEach(
              (track: {
                id: string;
                name: string;
                album: { name: string };
              }) => {
                savedTracks.push({
                  name: track.name,
                  id: track.id,
                  artistName: artist.name,
                  albumName: track.album.name,
                });
              }
            );
        }
      } catch (error) {
        console.error(`Error processing artist ${artist.name}:`, error);
      }
    }

    return savedTracks;
  }
);

function findBestMatch(
  searchName: string,
  artists: SpotifyArtist[]
): ArtistResult | null {
  const searchNameLower = searchName.toLowerCase();

  const exactMatch = artists.find(
    (artist) => artist.name.toLowerCase() === searchNameLower
  );
  if (exactMatch) {
    return transformArtist(exactMatch);
  }

  const partialMatch = artists.find(
    (artist) =>
      artist.name.toLowerCase().includes(searchNameLower) ||
      searchNameLower.includes(artist.name.toLowerCase())
  );
  if (partialMatch) {
    return transformArtist(partialMatch);
  }

  if (artists.length > 0) {
    return transformArtist(artists[0]);
  }

  return null;
}

function transformArtist(artist: SpotifyArtist): ArtistResult {
  return {
    name: artist.name,
    id: artist.id,
    genres: artist.genres,
    profileUrl: artist.external_urls.spotify,
    imageUrl: artist.images[0]?.url || "", // Use the first image if available, or an empty string
  };
}

async function searchArtist(artistName: string, token: string): Promise<ArtistResult | null> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.artists.items.length > 0) {
      return findBestMatch(artistName, data.artists.items);
    }

    console.warn(`No Spotify artist found for: ${artistName}`);
    return null;
  } catch (error) {
    console.error(`Error searching for artist ${artistName}:`, error);
    return null;
  }
}

export async function GetArtists(artists: string[]): Promise<ArtistResult[]> {
  noStore();
  const session = await auth();

  if (!session?.token) {
    throw new Error("No valid Spotify session found");
  }

  const batchSize = 10;
  const results: ArtistResult[] = [];

  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (artistName) => {
        let result = await searchArtist(artistName, session.token as string);
        if (!result) {
          // Retry once after a short delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          result = await searchArtist(artistName, session.token as string);
        }
        return result;
      })
    );
    results.push(...batchResults.filter((result): result is ArtistResult => result !== null));
  }

  const notFoundArtists = artists.filter(artist => 
    !results.some(result => result.name.toLowerCase() === artist.toLowerCase())
  );

  if (notFoundArtists.length > 0) {
    console.warn("Artists not found:", notFoundArtists);
  }

  return results;
}
