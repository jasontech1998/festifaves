"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function Login() {
  return (
    <div className="m-4 flex flex-col items-center">
      <Button
        className="w-48 flex items-center justify-center"
        onClick={() => signIn("spotify", { callbackUrl: "/home" })}
      >
        <Music className="mr-2 h-6 w-6" />
        Sign in with Spotify
      </Button>
    </div>
  );
}
