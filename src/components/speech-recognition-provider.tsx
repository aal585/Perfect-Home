"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SpeechRecognitionContextType {
  transcript: string;
  listening: boolean;
  browserSupportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
  startListening: (options?: { language?: string }) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

const SpeechRecognitionContext = createContext<SpeechRecognitionContextType>({
  transcript: "",
  listening: false,
  browserSupportsSpeechRecognition: false,
  isMicrophoneAvailable: false,
  startListening: () => {},
  stopListening: () => {},
  resetTranscript: () => {},
});

export const useSpeechRecognition = () => useContext(SpeechRecognitionContext);

interface SpeechRecognitionProviderProps {
  children: ReactNode;
}

export const SpeechRecognitionProvider = ({
  children,
}: SpeechRecognitionProviderProps) => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [
    browserSupportsSpeechRecognition,
    setBrowserSupportsSpeechRecognition,
  ] = useState(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(false);

  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      setBrowserSupportsSpeechRecognition(true);

      // Create a speech recognition instance
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onstart = () => {
        setListening(true);
      };

      recognitionInstance.onend = () => {
        setListening(false);
      };

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onerror = (event: any) => {
        if (event.error === "not-allowed") {
          setIsMicrophoneAvailable(false);
        }
      };

      setRecognition(recognitionInstance);

      // Check if microphone is available
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsMicrophoneAvailable(true);
        })
        .catch(() => {
          setIsMicrophoneAvailable(false);
        });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = (options?: { language?: string }) => {
    if (recognition && !listening) {
      setTranscript("");
      if (options?.language) {
        recognition.lang = options.language;
      }
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return (
    <SpeechRecognitionContext.Provider
      value={{
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        startListening,
        stopListening,
        resetTranscript,
      }}
    >
      {children}
    </SpeechRecognitionContext.Provider>
  );
};

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}
