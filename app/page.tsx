"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { FaHandPointDown } from "react-icons/fa";
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Simulate loading effect (for example, fetching data)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  const handleMitest = () => {
    router.push("/email");
  };

  return (
    <div
      className="relative w-full h-screen bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/assets/Home/bgimg.jpg')",
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <Loading />
        </div>
      )}

      {/* Logo and pin */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-10">
        <div className="flex-1 flex justify-center md:justify-start mb-10 md:mb-0">
          <Image
            src="/assets/Home/logo.svg"
            width={300}
            height={300}
            alt="logo"
            className="w-48 md:w-72 ultra:w-[800px] 4k:w-[600px] lg:w-[220px]"
          />
        </div>
        <div className="hidden md:block">
          <Image
            src="/assets/Home/pin.png"
            width={200}
            height={200}
            alt="pin"
            className="w-36 md:w-52 ultra:w-[800px] 4k:w-[500px] lg:w-[200px]"
          />
        </div>
      </div>

      {/* Boxes */}
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start lg:space-x-20 space-y-10 lg:space-y-0 px-4 md:px-20">
        <div className="relative flex-col w-full lg:w-auto">
          {/* Main image */}
          <Image
            src="/assets/Home/Event.png"
            width={900}
            height={500}
            alt="Event"
            className="w-full lg:w-[700px] xl:w-[700px] h-auto ultra:w-[3000px] 4k:w-[2000px] "
          />

          {/* Icon and Button in flex-col with gap */}
          <div className="absolute bottom-14 right-14 flex flex-col items-center gap-4 4k:bottom-24 4k:right-24">
            {/* Icon with bouncing and automatic color changing animation */}
            <FaHandPointDown className="text-3xl ultra:text-6xl animate-bounce animate-color-change 4k:text-6xl" />

            {/* Button */}
            <button
              onClick={handleMitest}
              className="bg-[#002242] text-white px-6 py-3 rounded hover:bg-[#002242]/80 text-sm md:text-base ultra:text-5xl ultra:px-16 ultra:py-10 4k:text-4xl 4k:px-16 4k:py-10 lg:text-sm lg:px-4 lg:py-4"
            >
              Take MI Test
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="w-full lg:w-2/5 h-full xl:w-1/3">
          <video className="w-full rounded-lg shadow-lg" autoPlay muted loop>
            <source
              src="https://pentadacademy.s3.ap-southeast-2.amazonaws.com/MI+intro.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Pencil image */}
      <div className="absolute bottom-0 left-0 transform -rotate-90 hidden md:block">
        <Image
          src="/assets/Home/pencil.png"
          width={400}
          height={100}
          alt="pencil"
          className="w-32 md:w-48 lg:w-64 ultra:w-[1000px] 4k:w-[600px] xl:w-[180px]"
        />
      </div>
    </div>
  );
}
