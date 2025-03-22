import { NextRequest, NextResponse } from "next/server"

// This would come from environment variables in production
const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_ASSISTANT_ID = process.env.PINECONE_ASSISTANT_ID

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!PINECONE_API_KEY || !PINECONE_ASSISTANT_ID) {
      return NextResponse.json(
        { error: "Pinecone API key or Assistant ID not configured on server" },
        { status: 500 }
      )
    }

    console.log("Getting context snippets for:", PINECONE_ASSISTANT_ID)

    // Get context snippets from Pinecone using the correct API endpoint
    const response = await fetch(
      `https://prod-1-data.ke.pinecone.io/assistant/chat/${PINECONE_ASSISTANT_ID}/context-snippets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PINECONE_API_KEY
        },
        body: JSON.stringify({
          query
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Pinecone API error:", response.status, errorText)
      return NextResponse.json(
        { error: `Pinecone API error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error retrieving context snippets:", error)
    return NextResponse.json(
      { error: "Failed to retrieve context snippets" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Simple health check endpoint
  return NextResponse.json({ status: "Pinecone context API operational" })
}
