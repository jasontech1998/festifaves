import React from "react";
import AuthenticatedAction from "@/components/AuthenticatedAction";

export default function FestiFaves() {

  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-32 p-8 gap-12">
      <div className="md:w-1/2 max-w-xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Discover Your Festival Playlist
        </h2>
        <p className="text-xl mb-6">
          FestiFaves analyzes your festival lineup and creates a personalized
          playlist featuring your favorite artists. Get ready to groove to the
          beats you love!
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Seamlessly integrates with your Spotify account</li>
          <li>Customized playlists based on festival lineups</li>
          <li>Discover new tracks from your favorite artists</li>
        </ul>
      </div>

      <div className="md:w-1/2 max-w-md w-full">
        <AuthenticatedAction />
      </div>
    </div>
  );
}
