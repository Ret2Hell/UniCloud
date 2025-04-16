"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AiChat = ({ isOpen, onOpenChange, fileName }: AiChatProps) => {
  const [aiMessage, setAiMessage] = useState("");
  const [aiConversation, setAiConversation] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (!scrollContainerRef.current || !shouldAutoScroll) return;

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [aiConversation, shouldAutoScroll]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // For testing purposes, we simulate an AI response until i implement the actual AI service.
  const handleAiSend = () => {
    if (!aiMessage.trim()) return;

    setAiConversation((prev) => [
      ...prev,
      { role: "user", content: aiMessage },
    ]);

    setShouldAutoScroll(true);

    setTimeout(() => {
      setAiConversation((prev) => [
        ...prev,
        {
          role: "ai",
          content: `I've analyzed "${fileName}". This is a simulated AI response. In a real implementation, this would connect to an AI service.`,
        },
      ]);
    }, 1000);

    setAiMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat with AI about {fileName}</DialogTitle>
          <DialogDescription>
            Ask questions about this pdf file and get AI-powered insights.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[400px]">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto pr-4"
            onScroll={handleScroll}
          >
            <div className="space-y-4 p-4">
              {aiConversation.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Start a conversation about this pdf file
                </p>
              ) : (
                aiConversation.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-[#696cff] text-white ml-8"
                        : "bg-muted mr-8"
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Input
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Ask a question..."
              onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
            />
            <Button size="icon" onClick={handleAiSend}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChat;
