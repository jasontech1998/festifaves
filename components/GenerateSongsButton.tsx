"use client";

import React, { useState } from 'react';
import { ArtistResult, CreatePlaylist } from "@/lib/actions";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

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
    <div className="flex flex-col">
      <Button
        onClick={handleGeneratePlaylist}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating Playlist...' : 'Generate Festival Playlist'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GenerateSongsButton;