"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Result() {
  const [intelligenceNames, setIntelligenceNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      const examId = localStorage.getItem("examId");
      const userId = localStorage.getItem("userId");

      if (!examId || !userId) {
        setError(
          "Missing examId or userId. Please complete the questions first."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/getAnswers/${examId}/${userId}`
        );
        if (response.data.status && response.data.intelligenceNames) {
          setIntelligenceNames(response.data.intelligenceNames);
        } else {
          setError("Failed to fetch results. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setError(
          "An error occurred while fetching your results. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const countIntelligences = (names: string[]) => {
    return names.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const intelligenceCounts = countIntelligences(intelligenceNames);

  return (
    <div
      className="w-full min-h-screen bg-center bg-no-repeat bg-cover flex justify-center items-center relative"
      style={{ backgroundImage: "url('/assets/Home/bgimg.jpg')" }}
    >
      <div className="relative flex justify-center items-center z-10">
        <Image
          src="/assets/Result/QR.png"
          width={1000}
          height={500}
          alt="Whitebox"
          className="ultra:w-[3000px]"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-3/4">
          {loading ? (
            <p className="text-[#ff8c8c] text-xl">Loading your results...</p>
          ) : error ? (
            <p className="text-red-500 text-xl">{error}</p>
          ) : (
            <>
              <ul className="text-[#ff8c8c] text-3xl mt-12 ultra:text-6xl">
                {intelligenceNames.map((name, index) => (
                  <span key={index} className="mb-2 ultra:mt-14">
                    {name} {""}
                    {""}
                  </span>
                ))}
              </ul>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-[#002242] text-white px-4 py-2 rounded ultra:px-16 ultra:py-10 ultra:text-5xl ultra:mt-6"
              >
                Back to Home
              </button>
            </>
          )}
        </div>
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 z-[1]">
          <Image
            src="/assets/Result/Stickynotes.png"
            width={250}
            height={150}
            alt="stickybox"
            className="ultra:w-[600px]"
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 transform -rotate-90">
        <Image
          src="/assets/Home/pencil.png"
          width={400}
          height={100}
          alt="pencil"
          className="ultra:w-[1000px]"
        />
      </div>
      <div className="absolute bottom-0 right-0 transform -rotate-90">
        <Image
          src="/assets/Home/pin.png"
          width={200}
          height={200}
          alt="pin"
          className="ultra:w-[800px]"
        />
      </div>
    </div>
  );
}
