"use client";

import { useState } from "react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
}

/**
 * An optional component that simulates voice-to-text input.
 * In a full implementation, this would use a library like `react-hook-speech-to-text`.
 * @param {object} props The component props.
 * @param {Function} props.onTranscript A callback to handle the transcribed text.
 * @returns {JSX.Element} The voice input button component.
 */
export default function VoiceInputButton({
  onTranscript,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);

  // This is a placeholder for a real voice-to-text hook.
  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate a transcribed result.
      const simulatedText =
        "The user wants a new AI ticket feature with a voice input. It should create a story in Shortcut with all the required fields.";
      onTranscript(simulatedText);
    } else {
      setIsListening(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow-sm font-semibold transition-colors duration-200 ${
        isListening
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 6v-1.5m6 1.5l-2.25 2.25m-3.75-5.25 1.5 1.5m-1.5-1.5-1.5-1.5m6 1.5-1.5-1.5m0 0-1.5-1.5m0 3a2.25 2.25 0 0 1-2.25-2.25V7.5a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5m-6 6v-1.5m6 1.5h1.5m0 0l-2.25 2.25m-3.75-5.25-1.5 1.5m1.5 1.5 1.5-1.5m-1.5-1.5 1.5 1.5m0 0 1.5-1.5M12 21a9 9 0 0 1-9-9h1.5a7.5 7.5 0 0 0 7.5 7.5z"
        />
      </svg>
      <span>{isListening ? "Stop Listening" : "Voice Input"}</span>
    </button>
  );
}
