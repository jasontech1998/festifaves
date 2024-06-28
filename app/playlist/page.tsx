"use client";

import React, { useEffect, useState } from 'react';
import { SavedTrack } from "@/lib/actions";
import { Music } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PlaylistPage: React.FC = () => {
  const [playlist, setPlaylist] = useState<SavedTrack[]>([]);

  useEffect(() => {
    const storedPlaylist = localStorage.getItem('festifaves_playlist');
    if (storedPlaylist) {
      setPlaylist(JSON.parse(storedPlaylist));
    }
  }, []);

  const handleCreatePlaylist = () => {
    console.log("Creating playlist...");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Your Festival Playlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {playlist.length > 0 ? (
            <ul className="space-y-4">
              {playlist.map((track, index) => (
                <li key={index} className="flex items-center p-2 bg-accent rounded-lg">
                  <Music className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <h2 className="font-semibold">{track.name}</h2>
                    <p className="text-sm text-gray-600">{track.artistName}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No tracks found in your playlist. Try generating a new playlist!</p>
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Spotify Playlist</CardTitle>
              <CardDescription>Turn your festival favorites into a Spotify playlist</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ready to take your festival vibes with you? Create a Spotify playlist with all these amazing tracks!</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;