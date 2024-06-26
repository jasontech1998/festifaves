"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function Login() {
  return (
    <div className="m-4 flex flex-col">
      <Button
        className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white py-6 text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full flex items-center justify-center"
        onClick={() => signIn()}
      >
        <Music className="mr-2 h-6 w-6" />
        Sign in with Spotify
      </Button>
    </div>
  );
}
