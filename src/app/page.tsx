"use client";

import AiTicketForm from "@/components/AiTicketForm";
import StatusDisplay from "@/components/StatusDisplay";
import { useTicketGenerator } from "@/hooks/useTicketGenerator";

export default function AiTicketPage() {
  // We'll use a placeholder user ID for this example. In a real app, this would come from a user authentication context.
  const userId = 123;
  const { status, shortcutStoryId, message } = useTicketGenerator();

  // The main form component is wrapped here to manage its state from the page level.
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-3xl font-bold mb-8">AI Ticket Generator</h1>
      </div>
      <div className="w-full max-w-3xl">
        <AiTicketForm userId={userId} />
        {status !== "idle" && (
          <StatusDisplay
            status={status}
            shortcutStoryId={shortcutStoryId}
            message={message}
          />
        )}
      </div>
    </main>
  );
}
