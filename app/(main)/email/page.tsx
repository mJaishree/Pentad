"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Loading from "../../loading";

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
        "https://det3xiufni.execute-api.ap-southeast-2.amazonaws.com/dev/api/v1/onBoard",
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
      <div className="flex justify-between items-center">
        <div className="flex-1 flex justify-center mb-20">
          <Image
            src="/assets/Home/logo.png"
            width={300}
            height={300}
            alt="logo"
          />
        </div>
        <div>
          <Image
            src="/assets/Home/pin.png"
            width={200}
            height={200}
            alt="pin"
          />
        </div>
      </div>

      {/* Boxes with input form */}
      <div className="flex justify-center items-start space-x-20">
        <div className="flex-col">
          <div className="relative">
            {/* Main image */}
            <Image
              src="/assets/Home/Whitebox.png"
              width={900}
              height={500}
              alt="Whitebox"
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
                  className="w-full max-w-lg p-4 text-lg rounded-md border-2 border-gray-300 focus:outline-none focus:border-[#002242] shadow-sm"
                  required
                />
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full max-w-lg p-4 text-lg rounded-md border-2 border-gray-300 focus:outline-none focus:border-[#002242] shadow-sm"
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-[#002242] text-white font-semibold text-lg py-3 px-10 rounded-md hover:bg-[#002242]/80 shadow-lg transition-all ${
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
        />
      </div>
    </div>
  );
}
