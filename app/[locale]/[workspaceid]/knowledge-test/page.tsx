"use client"

import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface KnowledgeTestPageProps {}

const KnowledgeTestPage: FC<KnowledgeTestPageProps> = () => {
  const [query, setQuery] = useState<string>("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/openai-knowledge/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || "Failed to get response from OpenAI knowledge API"
        )
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error testing OpenAI knowledge:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex size-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">
          Test OpenAI Knowledge Integration
        </h1>

        <Card className="mb-6 w-full">
          <CardHeader>
            <CardTitle>Query Testing</CardTitle>
            <CardDescription>
              Test queries against the James Kemps course knowledge base using
              OpenAI Responses API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter your query here..."
                className="flex-1"
                onKeyDown={e => e.key === "Enter" && handleTest()}
              />
              <Button onClick={handleTest} disabled={loading || !query.trim()}>
                {loading ? "Testing..." : "Test"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-red-500">
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Answer:</h3>
                  <div className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-4">
                    {result.answer?.[0]?.text || "No answer generated."}
                  </div>
                </div>

                {result.searchResults && (
                  <div>
                    <h3 className="text-lg font-medium">Search Results:</h3>
                    <div className="mt-2 rounded-md bg-gray-50 p-4">
                      <pre className="overflow-auto text-xs">
                        {JSON.stringify(result.searchResults, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium">Full Response:</h3>
                  <div className="mt-2 rounded-md bg-gray-50 p-4">
                    <pre className="overflow-auto text-xs">
                      {JSON.stringify(result.fullResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default KnowledgeTestPage
