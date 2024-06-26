"use client";

import React, { useEffect, useState } from 'react';
import { SavedTrack } from "@/lib/actions";

const PlaylistPage: React.FC = () => {
  const [playlist, setPlaylist] = useState<SavedTrack[]>([]);

  useEffect(() => {
    const storedPlaylist = localStorage.getItem('festifaves_playlist');
    if (storedPlaylist) {
      setPlaylist(JSON.parse(storedPlaylist));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Festival Playlist</h1>
      {playlist.length > 0 ? (
        <ul className="space-y-2">
          {playlist.map((track, index) => (
            <li key={index} className="p-2">
              <h2 className="font-semibold">{track.name}</h2>
              <p className="text-gray-300">{track.artistName}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tracks found in your playlist. Try generating a new playlist!</p>
      )}
    </div>
  );
};

export default PlaylistPage;