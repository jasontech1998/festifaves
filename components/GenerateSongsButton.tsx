"use client";

import React, { useState } from 'react';
import { ArtistResult, CreatePlaylist, SavedTrack } from "@/lib/actions";
import { useRouter } from 'next/navigation';

interface GenerateSongsButtonProps {
  artists: ArtistResult[];
}

const GenerateSongsButton: React.FC<GenerateSongsButtonProps> = ({ artists }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGeneratePlaylist = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const savedTracks = await CreatePlaylist(artists);
      console.log('Saved tracks:', savedTracks);
      
      // Store the savedTracks in local storage
      localStorage.setItem('festifaves_playlist', JSON.stringify(savedTracks));
      
      // Navigate to the playlist page
      router.push('/playlist');
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError("Failed to create playlist. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGeneratePlaylist}
        disabled={isGenerating}
        className={`w-full font-bold py-2 px-4 rounded transition duration-300 ${
          isGenerating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-purple-500 text-white hover:bg-purple-600'
        }`}
      >
        {isGenerating ? 'Generating Playlist...' : 'Generate Festival Playlist'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GenerateSongsButton;