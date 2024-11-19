"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHandPointDown } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMitest = () => {
    router.push("/email")
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://pentadacademy.s3.ap-southeast-2.amazonaws.com/Expovideo.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-4 z-10">
        <FaHandPointDown className="text-3xl 4k:text-6xl text-[#002242]  animate-bounce" />
        <button
          onClick={handleMitest}
          className="text-[#002242] bg-[#BDA16C]
   px-6 py-3 4k:text-6xl 4k:py-8 4k:px-16 rounded   text-base font-bold transition-colors duration-300 ease-in-out"
        >
          Take MI Test
        </button>
      </div>
    </div>
  );
}
