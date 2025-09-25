
import { db } from '@/db';
import { aiTickets } from '@/db/schema';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { ShortcutClient } from '@shortcut/client';
import { NextRequest, NextResponse } from 'next/server';
import { ApiRequestBody, ApiResponse, GeminiOutputSchema } from './types';

/**
 * Defines the structure of the Gemini API's response schema. This is a critical
 * step in ensuring the AI returns a predictable and parsable JSON object.
 * This schema is defined as a constant to be reusable and easy to manage.
 */
const geminiResponseSchema = {
  type: SchemaType.OBJECT as const,
  properties: {
    objective: { type: SchemaType.STRING as const },
    background: { type: SchemaType.STRING as const },
    scopeOfWork: { type: SchemaType.STRING as const },
    technicalRequirements: { type: SchemaType.STRING as const },
    testingRequirements: { type: SchemaType.STRING as const },
  },
  required: ['objective', 'background', 'scopeOfWork', 'technicalRequirements', 'testingRequirements'],
};

/**
 * Handles the POST request to create an AI-generated ticket.
 * @param request The incoming Next.js request.
 * @returns {Promise<NextResponse>} A JSON response indicating success or failure.
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse | { status: 'error'; message: string }>> {
  try {
    console.log('API route called');
    
    // Check environment variables first
    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return NextResponse.json(
        { status: 'error', message: 'Server configuration error: Missing GEMINI_API_KEY.' },
        { status: 500 }
      );
    }
    
    if (!process.env.SHORTCUT_API_KEY) {
      console.error('Missing SHORTCUT_API_KEY environment variable');
      return NextResponse.json(
        { status: 'error', message: 'Server configuration error: Missing SHORTCUT_API_KEY.' },
        { status: 500 }
      );
    }
    
    if (!process.env.DATABASE_URL) {
      console.error('Missing DATABASE_URL environment variable');
      return NextResponse.json(
        { status: 'error', message: 'Server configuration error: Missing DATABASE_URL.' },
        { status: 500 }
      );
    }

    console.log('Environment variables check passed');

    // 1. Request Handling and Validation
    const body: ApiRequestBody = await request.json();
    const { prompt, userId } = body;
    
    console.log('Request body parsed:', { prompt: prompt?.substring(0, 50), userId });

    if (!prompt || typeof prompt!== 'string' || !userId ||typeof userId!== 'number') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or missing prompt or userId.' },
        { status: 400 }
      );
    }

    // 2. Gemini API Interaction
    // Initialize the Gemini client using the API key from environment variables.
    const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Construct a highly-specific prompt using the PTCF framework.
    const geminiPrompt = `
      You are a senior product manager and an expert technical writer.
      Your task is to convert a raw, unstructured user prompt into a formal, structured JSON payload for a software development ticket.
      The context is a user story or a request from a product manager.
      Your output must be a single JSON object that strictly adheres to the provided schema.

      User Prompt:
      "${prompt}"
    `;

    // Make the API call with the structured schema.
    const geminiResult = await geminiClient
     .getGenerativeModel({ model: 'gemini-1.5-flash' })
     .generateContent({
        contents: [{ role: 'user', parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: geminiResponseSchema,
        },
      });

    // Parse the AI's response text into a JSON object.
    const geminiOutput: GeminiOutputSchema = JSON.parse(geminiResult.response.text());

    // 3. Shortcut API Integration
    // Initialize the Shortcut client with the API key.
    const shortcutClient = new ShortcutClient(process.env.SHORTCUT_API_KEY!);

    // Map the AI-generated data to the Shortcut API payload.
    // The objective becomes the story's name, and all other fields are combined into the description.
    const shortcutPayload: any = {
      name: geminiOutput.objective,
      description: `
**Background:**
${geminiOutput.background}

**Scope of Work:**
${geminiOutput.scopeOfWork}

**Technical Requirements:**
${geminiOutput.technicalRequirements}

**Testing Requirements:**
${geminiOutput.testingRequirements}
      `.trim(),
      // Required fields for Shortcut API - using environment variables or defaults
      project_id: parseInt(process.env.SHORTCUT_PROJECT_ID || '1'),
    };

    // Only add workflow_state_id if it's provided and valid
    if (process.env.SHORTCUT_WORKFLOW_STATE_ID && process.env.SHORTCUT_WORKFLOW_STATE_ID !== '1') {
      shortcutPayload.workflow_state_id = parseInt(process.env.SHORTCUT_WORKFLOW_STATE_ID);
      console.log('Using workflow_state_id:', shortcutPayload.workflow_state_id);
    } else {
      console.log('Skipping workflow_state_id - using default');
    }

    console.log('Shortcut payload:', shortcutPayload);
    console.log('Environment variables:', {
      SHORTCUT_PROJECT_ID: process.env.SHORTCUT_PROJECT_ID,
      SHORTCUT_WORKFLOW_STATE_ID: process.env.SHORTCUT_WORKFLOW_STATE_ID
    });

    // Make the request to create the story in Shortcut.
    console.log('Creating story in Shortcut...');
    let shortcutStory;
    try {
      shortcutStory = await shortcutClient.createStory(shortcutPayload);
      console.log('Shortcut story created:', shortcutStory.data.id);
    } catch (shortcutError: any) {
      console.error('Shortcut API error:', shortcutError.response?.data || shortcutError.message);
      throw new Error(`Shortcut API error: ${shortcutError.response?.data?.message || shortcutError.message}`);
    }

    // 4. Database Persistence
    // Log the transaction in the Neon database.
    console.log('Attempting database insert...');
    await db.insert(aiTickets).values({
      userId,
      rawPrompt: prompt,
      geminiOutput: geminiOutput as any, // Drizzle's jsonb type requires a type assertion
      shortcutStoryId: shortcutStory.data.id,
      updatedAt: new Date(),
    });
    console.log('Database insert successful');

    // 5. Final Response
    return NextResponse.json({
      status: 'success',
      shortcutStoryId: shortcutStory.data.id,
      message: 'AI ticket created successfully.',
    }, { status: 201 });

  } catch (error) {
    console.error('API Ticket creation failed:', error);
    
    // Provide more specific error messages for debugging
    let errorMessage = 'An internal server error occurred.';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API configuration error.';
      } else if (error.message.includes('database') || error.message.includes('connection')) {
        errorMessage = 'Database connection error.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'External API error.';
      }
    }
    
    return NextResponse.json(
      { status: 'error', message: errorMessage },
      { status: 500 }
    );
  }
}