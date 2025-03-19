"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 10;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Loading
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300 ease-in-out"
            ></div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="animate-bounce mx-1 h-3 w-3 rounded-full bg-blue-600"></div>
          <div
            className="animate-bounce mx-1 h-3 w-3 rounded-full bg-blue-600"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="animate-bounce mx-1 h-3 w-3 rounded-full bg-blue-600"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
