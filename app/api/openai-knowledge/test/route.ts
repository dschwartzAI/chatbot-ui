import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Get the API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// The vector store ID where your knowledge base is stored
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured on server" },
        { status: 500 }
      )
    }

    if (!VECTOR_STORE_ID) {
      return NextResponse.json(
        { error: "OpenAI Vector Store ID not configured on server" },
        { status: 500 }
      )
    }

    console.log("Testing OpenAI knowledge query with:", query)

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    })

    // Call the OpenAI Responses API
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: query,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [VECTOR_STORE_ID],
          max_num_results: 3
        }
      ],
      include: ["file_search_call.results"]
    })

    // Format the response for display
    const messageOutput = response.output.find(item => item.type === "message")
    const fileSearchCall = response.output.find(
      item => item.type === "file_search_call"
    )

    const formattedResponse = {
      answer: messageOutput?.content,
      searchResults: (fileSearchCall as any)?.search_results,
      fullResponse: response
    }

    return NextResponse.json(formattedResponse)
  } catch (error) {
    console.error("Error testing OpenAI knowledge query:", error)
    return NextResponse.json(
      { error: "Failed to process test query", details: error },
      { status: 500 }
    )
  }
}
