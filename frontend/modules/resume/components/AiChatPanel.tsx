import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { CanonicalResumeJson } from "../types/resume.dto";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiChatResponse {
  data: {
    message: string;
    updatedJson?: CanonicalResumeJson;
    updatedTitle?: string;
  };
}

interface AiChatPanelProps {
  resumeJson: CanonicalResumeJson;
  onResumeUpdate: (updatedJson: CanonicalResumeJson) => void;
  onTitleUpdate?: (title: string) => void;
  resumeId?: string;
  currentTitle?: string;
}

const SendIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const BotIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LoaderIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className + " animate-spin"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export function AiChatPanel({ resumeJson, onResumeUpdate, onTitleUpdate, resumeId, currentTitle }: AiChatPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI Resume Assistant. I can help you build and optimize your resume. Ask me to add experience, improve your summary, or suggest skills!",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { mutate: sendMessage, isPending } = useMutation<AiChatResponse, Error, string>({
    mutationFn: async (userMessage: string) => {
      const res = await axios.post("/resume/ai/chat", {
        message: userMessage,
        resumeJson,
        resumeId,
        currentTitle,
      });
      return res.data;
    },
    onMutate: (userMessage) => {
      // Optimistic update - show user message immediately
      const optimisticMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      return { optimisticId: optimisticMsg.id };
    },
    onSuccess: (response) => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If AI updated the resume, apply changes
      if (response.data.updatedJson) {
        onResumeUpdate(response.data.updatedJson);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "✅ I've updated your resume based on your request!",
            timestamp: new Date(),
          },
        ]);
      }
      // If AI updated the title, apply it
      if (response.data.updatedTitle && onTitleUpdate) {
        console.log("[AiChatPanel] Title updated:", response.data.updatedTitle);
        onTitleUpdate(response.data.updatedTitle);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 3).toString(),
            role: "assistant",
            content: `✅ Resume title updated to: "${response.data.updatedTitle}"`,
            timestamp: new Date(),
          },
        ]);
      }

      setMessage("");
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSend = () => {
    if (!message.trim() || isPending) return;
    sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Add a project",
    "Improve my summary",
    "Suggest skills for Software Engineer",
    "Add work experience",
    "Set resume title to my name and role",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full max-h-[500px]">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
        <BotIcon className="w-5 h-5 text-purple-500" />
        AI Chat Assistant
      </h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              "flex gap-2 transition-all duration-300",
              msg.role === "user" ? "flex-row-reverse" : "",
            ].join(" ")}
          >
            <div
              className={[
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600",
              ].join(" ")}
            >
              {msg.role === "user" ? <UserIcon className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
            </div>
            <div
              className={[
                "max-w-[80%] p-3 rounded-xl text-sm",
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none",
              ].join(" ")}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex gap-2 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <BotIcon className="w-3.5 h-3.5" />
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-none flex items-center gap-2">
              <span className="text-xs text-gray-500">AI typing...</span>
              <span className="flex gap-0.5">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length < 3 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => {
                setMessage(action);
                sendMessage(action);
              }}
              className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask AI to help with your resume..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={isPending}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isPending}
          className={[
            "bg-blue-500 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1",
            !message.trim() || isPending
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 hover:shadow-md hover:scale-[1.02]",
          ].join(" ")}
        >
          {isPending ? <LoaderIcon className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
