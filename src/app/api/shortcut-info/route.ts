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
    
    // Get all workflows
    const workflows = await shortcutClient.listWorkflows();
    
    // Get workflow states for the first workflow
    let workflowStates: any[] = [];
    if (workflows.data.length > 0) {
      const firstWorkflow = workflows.data[0];
      try {
        const states = await shortcutClient.listWorkflowStates();
        workflowStates = states.data;
      } catch (error) {
        console.log('Could not fetch workflow states:', error);
      }
    }

    return NextResponse.json({
      status: 'success',
      projects: projects.data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description
      })),
      workflows: workflows.data.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description
      })),
      workflowStates: workflowStates.map(state => ({
        id: state.id,
        name: state.name,
        description: state.description,
        type: state.type
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
