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

    console.log('Querying Pinecone Assistant:', PINECONE_ASSISTANT_ID);
    
    // Call Pinecone Assistant API with the correct endpoint URL format
    const response = await fetch(
      `https://prod-1-data.ke.pinecone.io/assistant/chat/${PINECONE_ASSISTANT_ID}/chat/completions`,
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
          stream: false,
          include_citations: false  // Explicitly disable citations
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinecone API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Pinecone API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Process the response to strip out any references section
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let content = data.choices[0].message.content;
      
      // Remove any "References:" section and everything after it
      const referencesIndex = content.indexOf('References:');
      if (referencesIndex !== -1) {
        content = content.substring(0, referencesIndex).trim();
        data.choices[0].message.content = content;
      }
      
      // Also remove any reference patterns like "[1]", "[2]", etc.
      data.choices[0].message.content = content.replace(/\[\d+\]/g, '');
    }
    
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
  return NextResponse.json({ status: 'Pinecone chat API operational' });
} 