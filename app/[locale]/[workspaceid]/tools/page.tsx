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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface Props {}

const Tools: FC<Props> = () => {
  const [selectedTab, setSelectedTab] = useState("text")
  const [text, setText] = useState("")
  const [chunks, setChunks] = useState<string[]>([])

  const handleTextSubmit = () => {
    const words = text.split(" ")
    const chunkSize = 3
    const newChunks = []

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ")
      newChunks.push(chunk)
    }

    setChunks(newChunks)
  }

  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Text</CardTitle>
                <CardDescription>
                  Enter text that you&apos;d like to process.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Text</Label>
                    <Textarea
                      placeholder="Enter your text here..."
                      value={text}
                      onChange={e => setText(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button onClick={handleTextSubmit}>Process</Button>
              </CardFooter>
            </Card>

            {chunks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>
                    Here are your processed results.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4">
                    {chunks.map((chunk, index) => (
                      <div key={index} className="grid gap-2">
                        <Label>Chunk {index + 1}</Label>
                        <Input value={chunk} readOnly />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                Upload files that you&apos;d like to process.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Files</Label>
                  <Input type="file" multiple />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button>Process</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Tools
