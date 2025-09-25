"use client";

import { useTicketGenerator } from "@/hooks/useTicketGenerator";
import { FormEvent, useState } from "react";
import TicketPreview from "./TicketPreview";
import VoiceInputButton from "./VoiceInputButton";

interface AiTicketFormProps {
  userId: number;
}

/**
 * Renders the main form for creating an AI-generated ticket.
 * It uses the `useTicketGenerator` hook to manage the full lifecycle.
 * @param {object} props The component props.
 * @param {number} props.userId The ID of the authenticated user.
 * @returns {JSX.Element} The form component.
 */
export default function AiTicketForm({ userId }: AiTicketFormProps) {
  const [prompt, setPrompt] = useState("");
  const { status, generatedData, generateTicket } = useTicketGenerator();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await generateTicket(prompt, userId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label
          htmlFor="prompt-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Enter your ticket description here
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 'Create a new feature for PMs to generate tickets with voice commands. The ticket should be created in the backlog column on Shortcut...'"
          disabled={status === "generating" || status === "creating"}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md shadow-sm font-semibold transition-colors duration-200 ${
            status === "generating" || status === "creating"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={status === "generating" || status === "creating"}
        >
          {status === "generating"
            ? "Generating..."
            : status === "creating"
            ? "Creating Ticket..."
            : "Generate AI Ticket"}
        </button>
        {/* The VoiceInputButton component would be integrated here */}
        <VoiceInputButton onTranscript={(text: string) => setPrompt(text)} />
      </div>

      {status === "reviewing" && generatedData && (
        <TicketPreview data={generatedData} />
      )}
    </form>
  );
}
