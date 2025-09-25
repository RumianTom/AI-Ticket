import { ShortcutClient } from '@shortcut/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.SHORTCUT_API_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Missing SHORTCUT_API_KEY environment variable' },
        { status: 500 }
      );
    }

    const shortcutClient = new ShortcutClient(process.env.SHORTCUT_API_KEY!);

    // Get all projects
    const projects = await shortcutClient.listProjects();
    
    // Get all workflow states
    const workflowStates = await shortcutClient.listWorkflowStates();

    return NextResponse.json({
      status: 'success',
      projects: projects.data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description
      })),
      workflowStates: workflowStates.data.map(state => ({
        id: state.id,
        name: state.name,
        description: state.description
      }))
    });

  } catch (error) {
    console.error('Error fetching Shortcut info:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
