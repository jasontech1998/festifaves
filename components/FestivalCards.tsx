"use client";

import Image from "next/image";
import { festivals } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function FestivalCards() {
  const router = useRouter();

  const handleFestivalClick = (festival: {
    id: number;
    name: string;
    src: string;
    artists: string[];
}) => {
    localStorage.setItem(
      "festifaves_artists",
      JSON.stringify(festival.artists)
    );
    localStorage.setItem("festifaves_festival_name", festival.name);
    localStorage.setItem("festifaves_image_url", festival.src);
    router.push("/artists");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
      {festivals.map((festival) => (
        <div
          className="flex cursor-pointer group"
          key={festival.id}
          onClick={() => handleFestivalClick(festival)}
        >
          <div className="transition-all duration-200 ease-in-out transform group-hover:-translate-y-4 group-hover:shadow-xl rounded-lg overflow-hidden">
            <Image
              src={festival.src}
              alt={`${festival.name} Image`}
              width={250}
              height={250}
              className="max-w-full max-h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}