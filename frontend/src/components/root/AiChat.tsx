"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessageMutation } from "@/state/api";

interface AiChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  fileName: string;
}

const AiChat = ({ isOpen, onOpenChange, fileId, fileName }: AiChatProps) => {
  const [aiMessage, setAiMessage] = useState("");
  const [aiConversation, setAiConversation] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [hasInitialized, setHasInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiConversation, isLoading]);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setAiConversation([
        {
          role: "ai",
          content: `Hello! I'm your AI assistant. Feel free to ask me any questions about this file, and I'll do my best to help you.`,
        },
      ]);
      setHasInitialized(true);
    }

    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen, fileName, hasInitialized]);

  const handleAiSend = async () => {
    if (!aiMessage.trim() || isLoading) return;

    setAiConversation((prev) => [
      ...prev,
      { role: "user", content: aiMessage },
    ]);
    setAiMessage("");

    try {
      const result = await sendMessage({
        content: aiMessage,
        fileId,
      }).unwrap();

      setAiConversation((prev) => [
        ...prev,
        { role: "ai", content: result.content },
      ]);
    } catch {
      setAiConversation((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chat with AI about {fileName}</DialogTitle>
          <DialogDescription>
            Ask questions about this pdf file and get AI-powered insights.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-4 p-4">
              {aiConversation.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Start a conversation about this pdf file
                </p>
              ) : (
                <>
                  {aiConversation.map((message, index) => (
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
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center p-3 rounded-lg bg-muted mr-8">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        AI is thinking...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Input
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Ask a question..."
              onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleAiSend} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChat;
