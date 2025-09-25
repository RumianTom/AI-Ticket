
/**
 * Defines the structure of the incoming request body from the frontend.
 */
export interface ApiRequestBody {
    prompt: string;
    userId: number;
  }
  
  /**
   * Defines the structured JSON output we expect from the Gemini API.
   * This schema is enforced via the `responseSchema` property in the API call.
   */
  export interface GeminiOutputSchema {
    objective: string;
    background: string;
    scopeOfWork: string;
    technicalRequirements: string;
    testingRequirements: string;
  }
  
  /**
   * Defines the structure of the successful response payload returned to the frontend.
   */
  export interface ApiResponse {
    status: 'success';
    shortcutStoryId: number;
    message: string;
  }