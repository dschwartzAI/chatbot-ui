import { FC, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"

interface PineconeKnowledgeSettingsProps {}

export const PineconeKnowledgeSettings: FC<PineconeKnowledgeSettingsProps> = () => {
  const [apiKey, setApiKey] = useState("")
  const [assistantId, setAssistantId] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Save the settings to local storage for now
      // In a production app, you would save these to a secure backend
      localStorage.setItem("PINECONE_API_KEY", apiKey)
      localStorage.setItem("PINECONE_ASSISTANT_ID", assistantId)
      
      setStatus("success")
    } catch (error) {
      console.error("Error saving Pinecone settings:", error)
      setStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pinecone Knowledge Settings</CardTitle>
        <CardDescription>
          Connect JamesBot to your Pinecone assistant to provide answers based on your knowledge database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pinecone-api-key">Pinecone API Key</Label>
          <Input
            id="pinecone-api-key"
            placeholder="sk-xxx..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
          />
          <p className="text-xs text-gray-500">
            Your Pinecone API key can be found in your Pinecone dashboard.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assistant-id">Assistant ID</Label>
          <Input
            id="assistant-id"
            placeholder="assistant_xxx..."
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            The ID of your Pinecone assistant.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
        {status === "success" && (
          <p className="ml-2 text-sm text-green-600">Settings saved successfully!</p>
        )}
        {status === "error" && (
          <p className="ml-2 text-sm text-red-600">Error saving settings. Please try again.</p>
        )}
      </CardFooter>
    </Card>
  )
} 