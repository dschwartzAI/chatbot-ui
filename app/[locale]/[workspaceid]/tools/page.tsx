import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ToolsPageProps {}

const ToolsPage: FC<ToolsPageProps> = () => {
  const [status, setStatus] = useState<string | null>(null);

  const checkPineconeStatus = async () => {
    try {
      const response = await fetch('/api/pinecone');
      const data = await response.json();
      setStatus(`Status: ${data.status}`);
    } catch (error) {
      setStatus('Error checking Pinecone status');
      console.error(error);
    }
  };

  return (
    <div className="flex size-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">JamesBot Knowledge System</h1>
        
        <Card className="mb-6 w-full">
          <CardHeader>
            <CardTitle>Pinecone Integration Status</CardTitle>
            <CardDescription>
              JamesBot uses Pinecone to provide answers based on your knowledge database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-700">
              The Pinecone integration is configured securely on the server. No API keys are exposed to users.
              Administrators can update the Pinecone configuration through environment variables.
            </p>
            <div className="flex items-center space-x-2">
              <Button onClick={checkPineconeStatus} variant="outline">
                Check Pinecone Status
              </Button>
              {status && (
                <span className="text-sm font-medium">{status}</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">
              To update Pinecone settings, please contact an administrator.
            </p>
          </CardFooter>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add Knowledge</CardTitle>
            <CardDescription>
              Upload documents to expand JamesBot's knowledge base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Knowledge management is handled through the Pinecone dashboard. Contact an administrator
              to add or update the knowledge base.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ToolsPage 