"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="m-4 flex flex-col">
        <p> Signed in as {session.user?.email}</p>
        <Button className="m-4" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }
  return (
    <div className="m-4 flex flex-col">
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
}
