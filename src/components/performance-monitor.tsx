"use client";

import { useEffect, useState } from "react";
import { lazyLoadImages } from "@/lib/performance-optimization";

export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
  });

  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          setMetrics((prev) => ({ ...prev, fcp: firstEntry.startTime }));
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          setMetrics((prev) => ({
            ...prev,
            fid: firstEntry.processingStart - firstEntry.startTime,
          }));
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        setMetrics((prev) => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      // Initialize lazy loading for images
      lazyLoadImages();
    }
  }, []);

  // Toggle visibility of performance metrics panel
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
        aria-label="Show performance metrics"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20v-6M6 20V10M18 20V4"></path>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Performance Metrics</h3>
        <button
          onClick={toggleVisibility}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close performance metrics"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>First Contentful Paint:</span>
          <span
            className={
              metrics.fcp < 1000
                ? "text-green-500"
                : metrics.fcp < 2500
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {(metrics.fcp / 1000).toFixed(2)}s
          </span>
        </div>
        <div className="flex justify-between">
          <span>Largest Contentful Paint:</span>
          <span
            className={
              metrics.lcp < 2500
                ? "text-green-500"
                : metrics.lcp < 4000
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {(metrics.lcp / 1000).toFixed(2)}s
          </span>
        </div>
        <div className="flex justify-between">
          <span>First Input Delay:</span>
          <span
            className={
              metrics.fid < 100
                ? "text-green-500"
                : metrics.fid < 300
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {metrics.fid.toFixed(2)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Cumulative Layout Shift:</span>
          <span
            className={
              metrics.cls < 0.1
                ? "text-green-500"
                : metrics.cls < 0.25
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {metrics.cls.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
