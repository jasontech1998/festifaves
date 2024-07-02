
import React from "react";
import HeroSection from "@/components/HeroSection";

export default function FestiFaves() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 px-4 lg:pt-36 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <HeroSection />
      </div>
    </div>
  );
}