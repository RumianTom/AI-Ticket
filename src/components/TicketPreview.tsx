import React from 'react';
import { GeminiOutputSchema } from "@/app/api/ai-ticket/types";

interface TicketPreviewProps {
  data: GeminiOutputSchema;
}

/**
 * A presentational component that displays the structured ticket data.
 * @param {object} props The component props.
 * @param {GeminiOutputSchema} props.data The AI-generated ticket data.
 * @returns {JSX.Element} The preview component.
 */
export default function TicketPreview({ data }: TicketPreviewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
        AI-Generated Ticket Preview
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Objective</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.objective}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Background</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.background}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Scope of Work</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.scopeOfWork}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Technical Requirements</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {data.technicalRequirements}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Testing Requirements</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {data.testingRequirements}
          </p>
        </div>
      </div>
    </div>
  );
}
