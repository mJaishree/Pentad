"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Option {
  text: string;
  intelligenceName: string;
}

interface Intelligence {
  questionText: string;
  options: Option[];
}

interface Question {
  questionId: string;
  intelligence: Intelligence;
}

interface ApiQuestion {
  questionId: { S: string };
  intelligence: {
    M: {
      questionText: { S: string };
      options: {
        L: Array<{
          M: {
            text: { S: string };
            intelligenceName: { S: string };
          };
        }>;
      };
    };
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QuestionsWithVideo() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [router]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get<{
        status: boolean;
        questions: ApiQuestion[];
      }>(`${BASE_URL}/api/v1/getQuestions`);
      if (response.data.status && response.data.questions) {
        const formattedQuestions: Question[] = response.data.questions.map(
          (q) => ({
            questionId: q.questionId.S,
            intelligence: {
              questionText: q.intelligence.M.questionText.S,
              options: q.intelligence.M.options.L.map((opt) => ({
                text: opt.M.text.S,
                intelligenceName: opt.M.intelligenceName.S,
              })),
            },
          })
        );
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
  };

  const storeAnswer = async (intelligenceName: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post<{ data: string }>(
        `${BASE_URL}/api/v1/storeAnswer/${userId}`,
        { intelligenceName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Answer stored:", response.data);
      if (response.data.data) {
        localStorage.setItem("examId", response.data.data);
      }
    } catch (error) {
      console.error("Error storing answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (selectedOption) {
      await storeAnswer(selectedOption.intelligenceName);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        router.push("/result");
      }
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-center bg-no-repeat bg-cover relative flex flex-col"
      style={{ backgroundImage: "url('/assets/Home/bgimg.jpg')" }}
    >
      <main className="flex-grow flex flex-col lg:flex-row justify-center items-center gap-8 p-4 md:p-10">
        <Card className="w-full lg:w-1/2 bg-white/90 shadow-xl">
          <CardContent className="p-6">
            <div className="relative mb-8">
              <Image
                src="/assets/Question/Ribbon.png"
                width={1200}
                height={300}
                alt="Question ribbon"
                className="w-full"
              />
              <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-xl md:text-2xl lg:text-2xl 4k:text-6xl font-bold text-white">
                {questions[currentQuestion].intelligence.questionText}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].intelligence.options.map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`relative border-2 p-4 cursor-pointer transition-all ${
                      selectedOption?.text === option.text
                        ? "border-[#002242] bg-[#002242]/10"
                        : "border-gray-300 hover:border-[#002242] hover:bg-[#002242]/5"
                    }`}
                  >
                    <Image
                      src="/assets/Question/Note.png"
                      width={500}
                      height={300}
                      alt="Option background"
                      className="w-full"
                    />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-sm md:text-base lg:text-lg 4k:text-4xl font-semibold text-black">
                      {option.text}
                    </span>
                  </button>
                )
              )}
            </div>
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleNext}
                disabled={isLoading || !selectedOption}
                className="bg-[#002242] text-white px-6 py-3 4k:text-2xl 4k:px-16 4k:py-8 rounded hover:bg-[#002242]/80 transition-colors"
              >
                {isLoading ? "Submitting..." : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="w-full lg:w-1/2 aspect-video rounded-lg overflow-hidden shadow-xl">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            preload="metadata"
          >
            <source
              src="https://pentadacademy.s3.ap-southeast-2.amazonaws.com/Expovideo.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </main>
    </div>
  );
}
