import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Get the API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// The vector store ID where your knowledge base is stored
// You will need to create this and fill it in
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

    console.log("Querying OpenAI Vector Store:", VECTOR_STORE_ID)
    console.log("With query:", query)

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
          // Optionally customize search parameters
          max_num_results: 5 // Adjust based on your needs
        }
      ],
      include: ["file_search_call.results"]
    })

    console.log("Received response from OpenAI Responses API")

    // Process the response for consistent format
    const messageOutput = response.output.find(item => item.type === "message")
    const fileSearchCall = response.output.find(
      item => item.type === "file_search_call"
    )

    // Extract text from the message content if available
    let answerText = null
    if (messageOutput?.content) {
      const textContent = messageOutput.content.find(
        (item: any) => item.type === "output_text"
      )
      if (textContent && "text" in textContent) {
        answerText = (textContent as any).text
      }
    }

    // Format the response in the same structure as our test endpoint
    const formattedResponse = {
      answer: answerText ? [{ text: answerText }] : [],
      searchResults: (fileSearchCall as any)?.search_results || [],
      fullResponse: response
    }

    console.log(
      "Formatted response:",
      JSON.stringify(formattedResponse, null, 2).substring(0, 500) + "..."
    )

    return NextResponse.json(formattedResponse)
  } catch (error) {
    console.error("Error processing OpenAI knowledge query:", error)
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Simple health check endpoint
  return NextResponse.json({ status: "OpenAI knowledge API operational" })
}
