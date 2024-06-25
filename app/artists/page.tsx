"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedArtists = localStorage.getItem('festifaves_artists');
    if (storedArtists) {
      setArtists(JSON.parse(storedArtists));
    }
  }, []);

  console.log(artists);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white p-8">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-3xl font-bold">FestiFaves</h1>
        <Button 
          onClick={() => router.push('/')}
          variant="ghost" 
          className="text-white hover:text-purple-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </header>

      <main>
        <h2 className="text-2xl font-bold mb-6">Artists Found</h2>
        <p className="text-xl mb-12">Here are the artists we found in your festival lineup:</p>

        <Card className="bg-opacity-20 bg-white backdrop-filter backdrop-blur-lg border-0">
          <CardContent className="p-6">
            <ScrollArea className="h-[500px] w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {artists.map((artist, index) => (
                  <div key={index} className="p-4 bg-purple-800 bg-opacity-50 rounded-lg text-center">
                    {artist}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}