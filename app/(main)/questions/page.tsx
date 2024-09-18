"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "../../loading";

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

export default function Questions() {
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
    } else {
      console.error("UserId not found");
      router.push("/email");
    }
  }, [router]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get<{
        status: boolean;
        questions: ApiQuestion[];
      }>(
        "https://det3xiufni.execute-api.ap-southeast-2.amazonaws.com/dev/api/v1/getQuestions"
      );
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
        `https://det3xiufni.execute-api.ap-southeast-2.amazonaws.com/dev/api/v1/storeAnswer/${userId}`,
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
      <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <Loading />
      </div>
    );
  }
  return (
    <div
      className="w-full min-h-screen bg-center bg-no-repeat bg-cover relative"
      style={{
        backgroundImage: "url('/assets/Home/bgimg.jpg')",
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <Loading />
        </div>
      )}
      <div className="relative flex justify-center p-10">
        <Image
          src="/assets/Question/Ribbon.png"
          width={1200}
          height={300}
          alt="ribbon"
        />
        <div className="absolute top-1/2 transform -translate-y-1/2 text-center md:text-4xl xl:text-4xl lg:text-4xl font-bold text-white text-md">
          {questions[currentQuestion].intelligence.questionText}
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 mt-10">
        {questions[currentQuestion].intelligence.options.map(
          (option, index) => (
            <div
              key={index}
              className={`relative border-2 p-4 cursor-pointer m-2 ${
                selectedOption?.text === option.text ? "border-[#002242]" : ""
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <Image
                src="/assets/Question/Note.png"
                width={500}
                height={300}
                alt="note"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center md:text-3xl xl:text-3xl lg:text-3xl font-semibold text-black text-xs">
                {option.text}
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex xl:justify-end lg:justify-end md:justify-end justify-center m-10">
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`bg-[#002242] text-white px-6 py-3 rounded hover:bg-[#002242]/80 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Next"}
        </button>
      </div>
    </div>
  );
}
