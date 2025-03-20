import { NextRequest, NextResponse } from 'next/server';

// This would come from environment variables in production
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ASSISTANT_ID = process.env.PINECONE_ASSISTANT_ID;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!PINECONE_API_KEY || !PINECONE_ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'Pinecone API key or Assistant ID not configured on server' },
        { status: 500 }
      );
    }

    // Call Pinecone Assistant API
    const response = await fetch(
      `https://api.pinecone.io/assistants/${PINECONE_ASSISTANT_ID}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': PINECONE_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: query,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Pinecone API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing Pinecone query:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Simple health check endpoint
  return NextResponse.json({ status: 'Pinecone API route operational' });
}

// Context snippets - we'll use a different HTTP method
export async function PUT(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!PINECONE_API_KEY || !PINECONE_ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'Pinecone API key or Assistant ID not configured on server' },
        { status: 500 }
      );
    }

    // Get context snippets from Pinecone
    const response = await fetch(
      `https://api.pinecone.io/assistants/${PINECONE_ASSISTANT_ID}/context-snippets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': PINECONE_API_KEY,
        },
        body: JSON.stringify({
          query,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Pinecone API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error retrieving context snippets:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve context snippets' },
      { status: 500 }
    );
  }
} 