"use client"

import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"

export default function SidebarWrapper() {
  const { chats, folders } = useContext(ChatbotUIContext)

  return (
    <div className="bg-muted/50 flex h-full w-[250px] flex-col p-3">
      <div className="mb-2 border-b pb-2">
        <div className="font-bold">Workspace</div>
      </div>

      <div className="overflow-auto">
        <div className="mb-2 font-medium">Chats</div>
        {chats.length === 0 && (
          <div className="text-muted-foreground text-sm italic">
            No chats yet
          </div>
        )}
        {chats.map(chat => (
          <div
            key={chat.id}
            className="hover:bg-muted mb-1 cursor-pointer truncate rounded p-1"
          >
            {chat.name}
          </div>
        ))}
      </div>
    </div>
  )
}
