"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/lib/store";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockConversations = [
  {
    id: "1",
    name: "Sarah Martinez",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    lastMessage: "Thank you so much! Dad really enjoyed the visit.",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
    role: "caregiver",
  },
  {
    id: "2",
    name: "Johnson Family",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Can we schedule for next Tuesday?",
    timestamp: "1 hour ago",
    unread: 0,
    online: false,
    role: "family",
  },
  {
    id: "3",
    name: "Emily Chen",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "I'll be there at 9am sharp!",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
    role: "caregiver",
  },
];

const mockMessages = [
  {
    id: "1",
    senderId: "other",
    text: "Hi! I wanted to check in about the visit tomorrow.",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: "2",
    senderId: "me",
    text: "Hi Sarah! Yes, I'm all set for tomorrow. Is 9 AM still good?",
    timestamp: "10:32 AM",
    read: true,
  },
  {
    id: "3",
    senderId: "other",
    text: "Perfect! Dad is really looking forward to it. He mentioned he'd like to go to the park if the weather is nice.",
    timestamp: "10:33 AM",
    read: true,
  },
  {
    id: "4",
    senderId: "me",
    text: "That sounds wonderful! I'll check the weather and plan accordingly. Should I bring any specific activities?",
    timestamp: "10:35 AM",
    read: true,
  },
  {
    id: "5",
    senderId: "other",
    text: "He loves playing chess if you're up for it! Also, his medications are on the kitchen counter.",
    timestamp: "10:36 AM",
    read: true,
  },
  {
    id: "6",
    senderId: "other",
    text: "Thank you so much! Dad really enjoyed the visit.",
    timestamp: "Just now",
    read: false,
  },
];

export default function MessagesPage() {
  const { role } = useAuthStore();
  const isAuthenticated = role !== null;
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: String(messages.length + 1),
        senderId: "me",
        text: newMessage,
        timestamp: "Just now",
        read: false,
      },
    ]);
    setNewMessage("");
  };

  const filteredConversations = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-1">
          {/* Conversations List */}
          <div
            className={cn(
              "flex w-full flex-col border-r border-border sm:w-80 lg:w-96",
              showMobileChat && "hidden sm:flex"
            )}
          >
            <div className="border-b border-border p-4">
              <h1 className="text-xl font-bold">Messages</h1>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setShowMobileChat(true);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
                      selectedConversation?.id === conversation.id && "bg-muted"
                    )}
                  >
                    <div className="relative">
                      <Image
                        src={conversation.photo}
                        alt={conversation.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-accent" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{conversation.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {conversation.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex flex-1 flex-col",
              !showMobileChat && "hidden sm:flex"
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sm:hidden"
                      onClick={() => setShowMobileChat(false)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="relative">
                      <Image
                        src={selectedConversation.photo}
                        alt={selectedConversation.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      {selectedConversation.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">{selectedConversation.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.senderId === "me" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            message.senderId === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div
                            className={cn(
                              "mt-1 flex items-center justify-end gap-1 text-xs",
                              message.senderId === "me"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            <span>{message.timestamp}</span>
                            {message.senderId === "me" && (
                              message.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
