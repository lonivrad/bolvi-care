"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/toast";
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
  MessageSquare,
  Smile,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileText, ImageIcon, Upload, X, File } from "lucide-react";

// Quick reply suggestions
const quickReplies = [
  "Thank you!",
  "I'll be there soon",
  "Can we reschedule?",
  "See you tomorrow!",
  "On my way!",
];

interface Conversation {
  id: string;
  name: string;
  photo: string | null;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  role: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversations from API
  useEffect(() => {
    async function fetchConversations() {
      if (status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual API call
        // const res = await fetch("/api/messages/conversations");
        // if (res.ok) {
        //   const data = await res.json();
        //   setConversations(data.conversations);
        // }

        // For now, show empty state for new users
        setConversations([]);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchConversations();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text?: string) => {
    const messageText = text || newMessage;
    if (!messageText.trim()) return;

    setMessages([
      ...messages,
      {
        id: String(messages.length + 1),
        senderId: "me",
        text: messageText,
        timestamp: "Just now",
        read: false,
      },
    ]);
    setNewMessage("");
    setShowQuickReplies(false);
    // TODO: Call API to send message
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleVideoCall = () => {
    toast({
      title: "Starting video call...",
      description: `Connecting to ${selectedConversation?.name}`,
      variant: "info",
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: "Starting call...",
      description: `Calling ${selectedConversation?.name}`,
      variant: "info",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendAttachment = () => {
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          senderId: "me",
          text: isImage ? `📷 ${selectedFile.name}` : `📎 ${selectedFile.name}`,
          timestamp: "Just now",
          read: false,
        },
      ]);
      toast({
        title: "File sent",
        description: `${selectedFile.name} has been sent successfully`,
        variant: "success",
      });
      setSelectedFile(null);
      setShowAttachmentDialog(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

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

            {conversations.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">No messages yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[200px]">
                  When you connect with caregivers or families, your conversations will appear here.
                </p>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setShowMobileChat(true);
                        // TODO: Fetch messages for this conversation
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
                        selectedConversation?.id === conversation.id && "bg-muted"
                      )}
                    >
                      <div className="relative">
                        {conversation.photo ? (
                          <Image
                            src={conversation.photo}
                            alt={conversation.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                            {getInitials(conversation.name)}
                          </div>
                        )}
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
            )}
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
                      {selectedConversation.photo ? (
                        <Image
                          src={selectedConversation.photo}
                          alt={selectedConversation.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {getInitials(selectedConversation.name)}
                        </div>
                      )}
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
                    <Button variant="ghost" size="icon" onClick={handleVoiceCall}>
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                      <Video className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({
                          title: "Profile",
                          description: `Viewing ${selectedConversation?.name}'s profile`,
                          variant: "info",
                        })}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({
                          title: "Muted",
                          description: "Notifications muted for this conversation",
                          variant: "success",
                        })}>
                          Mute Notifications
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => toast({
                          title: "Report submitted",
                          description: "Our team will review this conversation",
                          variant: "info",
                        })}>
                          Report Conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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

                {/* Quick Replies */}
                {showQuickReplies && (
                  <div className="border-t border-border px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAttachmentDialog(true)}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className={cn(showQuickReplies && "bg-muted")}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                      aria-label="Type your message"
                    />
                    <Button onClick={() => sendMessage()} disabled={!newMessage.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
                <div className="rounded-full bg-muted p-4">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {conversations.length === 0 ? "No messages yet" : "Select a conversation"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  {conversations.length === 0
                    ? "Start by finding a caregiver or waiting for families to contact you."
                    : "Choose a conversation from the list to start messaging with caregivers or families"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Attachment Dialog */}
      <Dialog open={showAttachmentDialog} onOpenChange={setShowAttachmentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Attachment</DialogTitle>
            <DialogDescription>
              Share a file or image with {selectedConversation?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {selectedFile ? (
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {selectedFile.type.startsWith('image/') ? (
                    <ImageIcon className="h-6 w-6 text-primary" />
                  ) : (
                    <FileText className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">Click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Images, PDFs, and documents up to 10MB
                </p>
              </div>
            )}

            {/* Quick options */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-auto py-3"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = ".pdf,.doc,.docx,.txt";
                    fileInputRef.current.click();
                  }
                }}
              >
                <File className="h-4 w-4 mr-2" />
                Document
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedFile(null);
              setShowAttachmentDialog(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSendAttachment} disabled={!selectedFile}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
