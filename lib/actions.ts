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
  savedTracks: any,
  userId: string
) {
  const session = await auth();
  try {
    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
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
      throw new Error("Failed to create playlist");
    }

    const playlistData = await createPlaylistResponse.json();

    const { id } = playlistData;
    const newPlaylistUrl = playlistData.external_urls.spotify;

    const playlistUrl = newPlaylistUrl;

    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: savedTracks,
        }),
      }
    );

    if (!addTracksResponse.ok) {
      throw new Error("Failed to add tracks to the playlist");
    }

    return playlistUrl;
  } catch (error) {
    console.log("error");
  }
}

export const CreatePlaylist = cache(
  async (artists: ArtistResult[]): Promise<SavedTrack[]> => {
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
         // if both of these didn't work, then just add the top 2 songs from the artist
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

export const GetArtists = cache(
  async (artists: string[]): Promise<ArtistResult[]> => {
    noStore();
    const session = await auth();

    if (!session?.token) {
      throw new Error("No valid Spotify session found");
    }

    const results = await Promise.all(
      artists.map(async (artistName) => {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              artistName
            )}&type=artist&limit=3`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.artists.items.length > 0) {
            return findBestMatch(artistName, data.artists.items);
          } else {
            console.warn(`No Spotify artist found for: ${artistName}`);
            return null;
          }
        } catch (error) {
          console.error(`Error searching for artist ${artistName}:`, error);
          return null;
        }
      })
    );

    return results.filter((result): result is ArtistResult => result !== null);
  }
);
