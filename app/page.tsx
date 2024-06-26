"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FestiFaves() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGeneratePlaylist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ask_ai", { method: "POST" });
      const data = await res.json();
      const parsedData = JSON.parse(data.message.content);
      
      // Store the artists data in localStorage
      localStorage.setItem('festifaves_artists', JSON.stringify(parsedData.artists));
      
      // Navigate to the artists page
      router.push('/artists');
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold">FestiFaves</h1>
      </header>

      <main>
        <h2 className="text-5xl font-bold mb-6">Welcome back, Festival Goer!</h2>
        <p className="text-xl mb-12">Generate your festival playlist now.</p>

        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-3xl font-semibold mb-6 text-center">Generate Playlist</h3>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                <p className="mb-6 text-center">Click the button below to generate your festival playlist based on the lineup!</p>
                <Button 
                  onClick={handleGeneratePlaylist} 
                  disabled={isLoading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Music className="mr-2 h-6 w-6" />
                  {isLoading ? "Generating..." : "Generate Festival Playlist"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
