"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TestPage() {
  const [artists, setArtists] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestAPI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ask_ai", { method: "POST" });
      const data = await res.json();

      // Parse the JSON string in the response
      const parsedData = JSON.parse(data.message.content);

      console.log(parsedData);

      // Set the artists array from the parsed data
      setArtists(parsedData.artists);
    } catch (error) {
      console.error("Error:", error);
      setArtists([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Test OpenAI API</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTestAPI} disabled={isLoading}>
            {isLoading ? "Loading..." : "Test API"}
          </Button>

          {artists.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <ul className="space-y-2">
                    {artists.map((artist, index) => (
                      <li key={index} className="text-sm">
                        {artist}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
