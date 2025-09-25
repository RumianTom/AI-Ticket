interface StatusDisplayProps {
  status:
    | "idle"
    | "generating"
    | "reviewing"
    | "creating"
    | "success"
    | "failed";
  shortcutStoryId: number | null;
  message: string | null;
}

/**
 * Renders a dynamic status message based on the current state.
 * @param {object} props The component props.
 * @param {string} props.status The current status of the workflow.
 * @param {number | null} props.shortcutStoryId The ID of the created Shortcut story.
 * @param {string | null} props.message A descriptive message to display.
 * @returns {JSX.Element | null} The status display component.
 */
export default function StatusDisplay({
  status,
  shortcutStoryId,
  message,
}: StatusDisplayProps) {
  if (status === "success") {
    const shortcutUrl = `https://app.shortcut.com/story/${shortcutStoryId}`;
    return (
      <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900 dark:border-green-600 dark:text-green-200">
        <h2 className="text-lg font-bold">Success!</h2>
        <p className="mt-2">
          The AI ticket was created successfully in Shortcut.
        </p>
        <a
          href={shortcutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          View Ticket
        </a>
      </div>
    );
  }

  if (status === "failed" && message) {
    return (
      <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-200">
        <h2 className="text-lg font-bold">Error</h2>
        <p className="mt-2">{message}</p>
      </div>
    );
  }

  return null;
}
