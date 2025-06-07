import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { generateEnhancedSystemPrompt } from '@/app/[lng]/chat/utils';

// Maximum duration for streaming responses
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json();
    
    // Get the enhanced system prompt with real product data
    const systemPrompt = await generateEnhancedSystemPrompt();

    // Use the streamText function to generate a streaming response
    const result = streamText({
      model: groq('llama3-70b-8192'),
      messages,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Return the response as a data stream
    return result.toDataStreamResponse({
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}