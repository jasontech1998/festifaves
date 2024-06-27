import Login from "@/components/Login";
import React from "react";

export default function FestiFaves() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 px-4 lg:pt-36 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Discover Your Festival Playlist
        </h1>
        <h2 className="scroll-m-20 pb-2 text-center text-lg tracking-tight first:mt-0 mx-8">
          FestiFaves analyzes your festival lineup and creates a personalized
          playlist featuring your favorite artists. Get ready to groove to the
          beats you love!
        </h2>
        <ul className="text-left list-none space-y-4 mb-8">
          <li className="flex items-center justify-center">
            <svg className="h-6 w-6 mr-2 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Seamlessly integrates with your Spotify account
          </li>
          <li className="flex items-center justify-center">
            <svg className="h-6 w-6 mr-2 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Customized playlists based on festival lineups
          </li>
          <li className="flex items-center justify-center">
            <svg className="h-6 w-6 mr-2 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Discover new tracks from your favorite artists
          </li>
        </ul>
        <Login />
      </div>
    </div>
  );
}