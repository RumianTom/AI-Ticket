import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      SHORTCUT_API_KEY: !!process.env.SHORTCUT_API_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL,
    };

    return NextResponse.json({
      status: 'healthy',
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
