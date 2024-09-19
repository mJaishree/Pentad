"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Loading from "../../loading";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Email() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/onBoard`,
        { name, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status) {
        localStorage.setItem("userId", response.data.user);
        router.push("/questions");
      } else {
        setError(
          response.data.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          console.error("Error response:", axiosError.response.data);
          console.error("Error status:", axiosError.response.status);
          console.error("Error headers:", axiosError.response.headers);
          setError(
            `Error: ${
              axiosError.response.data.message || axiosError.response.statusText
            }`
          );
        } else if (axiosError.request) {
          console.error("Error request:", axiosError.request);
          setError("No response received from the server. Please try again.");
        } else {
          console.error("Error message:", axiosError.message);
          setError(`An error occurred: ${axiosError.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
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
      {/* Logo and pin */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-10">
        <div className="flex-1 flex justify-center md:justify-start mb-10 md:mb-0">
          <Image
            src="/assets/Home/logo.svg"
            width={300}
            height={300}
            alt="logo"
            className="w-48 md:w-72 ultra:w-[800px]"
          />
        </div>
        <div>
          <Image
            src="/assets/Home/pin.png"
            width={200}
            height={200}
            alt="pin"
            className="w-36 md:w-52 ultra:w-[800px]"
          />
        </div>
      </div>

      {/* Boxes with input form */}
      <div className="flex justify-center items-center space-x-20">
        <div className="flex-col">
          <div className="relative">
            {/* Main image */}
            <Image
              src="/assets/Home/Whitebox.png"
              width={900}
              height={500}
              alt="Whitebox"
              className="w-full lg:w-[700px] xl:w-[900px] h-auto ultra:w-[3000px]"
            />
            {/* Form inside the image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-10">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center space-y-6"
              >
                <input
                  type="text"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-black p-4 text-lg rounded-md border-2 border-gray-300 focus:outline-none focus:border-[#002242] shadow-sm ultra:w-[2000px] ultra:text-5xl ultra:mb-12 ultra:border-6"
                  required
                />
                <input
                  type="text"
                  placeholder="Enter your Email / Phone Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-black p-4 text-lg rounded-md border-2 border-gray-300 focus:outline-none focus:border-[#002242] shadow-sm ultra:w-[2000px] ultra:text-5xl ultra:mb-12 ultra:border-6"
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-[#002242] text-white font-semibold text-lg py-3 px-10 rounded-md hover:bg-[#002242]/80 shadow-lg transition-all ultra:text-5xl ultra:px-16 ultra:py-10 ultra:mt-6 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Submitting..." : "Next"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Pencil image */}
      <div className="absolute bottom-0 left-0 transform -rotate-90">
        <Image
          src="/assets/Home/pencil.png"
          width={400}
          height={100}
          alt="pencil"
          className="w-32 md:w-48 lg:w-64 ultra:w-[1000px]"
        />
      </div>
    </div>
  );
}
