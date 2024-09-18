"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IntelligenceCount {
  [key: string]: number;
}

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
          `https://det3xiufni.execute-api.ap-southeast-2.amazonaws.com/dev/api/v1/getAnswers/${examId}/${userId}`
        );
        if (response.data.status && response.data.intelligenceNames) {
          setIntelligenceNames(response.data.intelligenceNames);
          router.push("/");
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

  const countIntelligences = (names: string[]): IntelligenceCount => {
    return names.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as IntelligenceCount);
  };

  const intelligenceCounts = countIntelligences(intelligenceNames);
  const topIntelligence = Object.entries(intelligenceCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div
      className="w-full min-h-screen bg-center bg-no-repeat bg-cover flex justify-center items-center relative"
      style={{
        backgroundImage: "url('/assets/Home/bgimg.jpg')",
      }}
    >
      <div className="relative flex justify-center items-center z-10">
        <Image
          src="/assets/Result/QR.png"
          width={900}
          height={500}
          alt="Whitebox"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-3/4">
          {loading ? (
            <p className="text-[#ff8c8c] text-xl">Loading your results...</p>
          ) : error ? (
            <p className="text-red-500 text-xl">{error}</p>
          ) : (
            <>
              <p className="text-[#ff8c8c] text-2xl font-bold mb-4">
                {topIntelligence ? topIntelligence[0] : "N/A"}
              </p>
              {/* <p className="text-[#002242] text-lg">Intelligence breakdown:</p>
              <ul className="text-[#ff8c8c] text-md">
                {Object.entries(intelligenceCounts).map(([name, count]) => (
                  <li key={name}>
                    {name}: {count}
                  </li>
                ))}
              </ul> */}
            </>
          )}
        </div>
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 z-[1]">
          <Image
            src="/assets/Result/Stickynotes.png"
            width={250}
            height={150}
            alt="stickybox"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 transform -rotate-90">
        <Image
          src="/assets/Home/pencil.png"
          width={400}
          height={100}
          alt="pencil"
        />
      </div>

      <div className="absolute bottom-0 right-0 transform -rotate-90">
        <Image src="/assets/Home/pin.png" width={200} height={200} alt="pin" />
      </div>
    </div>
  );
}
