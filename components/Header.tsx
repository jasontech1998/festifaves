"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="py-4 px-6">
      <div className="mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          FestiFaves
        </Link>
        {session && <Button  onClick={() => signOut({callbackUrl: '/'})}>Sign Out</Button>}
      </div>
    </header>
  );
}
