// src/hooks/useTicketGenerator.ts
import {
    ApiResponse, GeminiOutputSchema
} from '@/app/api/ai-ticket/types';
import { useState } from 'react';

// Define the state machine for the ticket creation workflow.
type Status =

| 'idle'
| 'generating'
| 'reviewing'
| 'creating'
| 'success'
| 'failed';

interface TicketState {
  status: Status;
  generatedData: GeminiOutputSchema | null;
  shortcutStoryId: number | null;
  message: string | null;
}

/**
 * A custom hook to manage the state and logic for the AI ticket generation and creation process.
 * @returns {object} The current state and functions to trigger the workflow.
 */
export function useTicketGenerator() {
  const [state, setState] = useState<TicketState>({
    status: 'idle',
    generatedData: null,
    shortcutStoryId: null,
    message: null,
  });

  /**
   * Orchestrates the call to the backend API to generate a structured ticket from a prompt.
   * @param {string} prompt The user's raw input prompt.
   * @param {number} userId The ID of the authenticated user.
   */
  const generateTicket = async (prompt: string, userId: number) => {
    setState({
     ...state,
      status: 'generating',
      message: 'Generating ticket...',
      generatedData: null,
      shortcutStoryId: null,
    });
    try {
      const response = await fetch('/api/ai-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId }),
      });

      const data: ApiResponse | { status: 'error'; message: string } = await response.json();

      if (response.ok && data.status === 'success') {
        const successData = data as ApiResponse;
        setState({
          status: 'success',
          generatedData: null, // The backend now directly creates the ticket, so we don't need this intermediary state.
          shortcutStoryId: successData.shortcutStoryId,
          message: successData.message,
        });
      } else {
        const errorData = data as { status: 'error'; message: string };
        throw new Error(errorData.message);
      }
    } catch (err) {
      setState({
       ...state,
        status: 'failed',
        message: err instanceof Error? err.message : 'An unknown error occurred.',
      });
    }
  };

  return {...state, generateTicket };
}