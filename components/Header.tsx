"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import FestiFavesLogo from "@/components/FestiFavesLogo";
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="py-4 px-6">
      <div className="mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          <motion.div 
            className="flex items-center gap-2"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <FestiFavesLogo isHovered={isHovered} />
            <span>FestiFaves</span>
          </motion.div>
        </Link>
        {session && (
          <Button onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}