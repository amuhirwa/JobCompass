import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Briefcase,
  BookOpen,
} from "lucide-react";
import api from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useToast } from "@/hooks/use-toast";

interface ChatbotProps {
  contextType?: "general" | "skill" | "occupation" | "resources" | "community";
  contextData?: {
    name?: string;
    description?: string;
    id?: string;
  };
}

const suggestedQuestions = {
  general: [
    "What skills are most in-demand right now?",
    "How can I plan my career development?",
    "What are the best ways to learn new skills?",
    "How do I transition to a new career field?",
  ],
  skill: [
    "How can I learn this skill effectively?",
    "What career opportunities use this skill?",
    "What other skills complement this one?",
    "How long does it take to master this skill?",
  ],
  occupation: [
    "What skills do I need for this career?",
    "What's the job market like for this role?",
    "How do I get started in this field?",
    "What's the typical career progression?",
  ],
  resources: [
    "How should I structure my learning plan?",
    "What's the best order to learn these skills?",
    "How much time should I spend learning daily?",
    "How do I track my progress effectively?",
  ],
  community: [
    "How can I network in my field?",
    "What are good ways to share knowledge?",
    "How do I find mentors in my industry?",
    "What career communities should I join?",
  ],
};

export function Chatbot({
  contextType = "general",
  contextData = {},
}: ChatbotProps) {
  const { isDark } = useDarkMode();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        message: "",
        response: getWelcomeMessage(),
        timestamp: Date.now(),
        isUser: false,
      };
      setMessages([welcomeMessage]);
    }
  }, [contextType, contextData]);

  const getWelcomeMessage = () => {
    const contextName = contextData.name;

    switch (contextType) {
      case "skill":
        return `Hi! I'm JobCompass AI I can help you with questions about ${contextName ? `"${contextName}"` : "skills"}, learning paths, career opportunities, and more. What would you like to know?`;
      case "occupation":
        return `Hello! I'm here to help with questions about ${contextName ? `"${contextName}"` : "occupations"}, required skills, career progression, and market insights. How can I assist you?`;
      case "resources":
        return `Welcome to your learning journey! I can help you plan your studies, recommend learning strategies, and track your progress. What are you working on?`;
      case "community":
        return `Hi there! I'm here to help with career networking, knowledge sharing, and professional development. What community questions do you have?`;
      default:
        return `Hello! I'm JobCompass AI, your career guidance assistant. I can help with skills, occupations, learning paths, and career planning. What can I help you with today?`;
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      message: currentMessage,
      response: "",
      timestamp: Date.now(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(
        currentMessage,
        contextType,
        contextData
      );

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        message: currentMessage,
        response: response.response,
        timestamp: response.timestamp,
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        message: currentMessage,
        response:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: Date.now(),
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setCurrentMessage(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getContextIcon = () => {
    switch (contextType) {
      case "skill":
        return <Sparkles className="w-4 h-4" />;
      case "occupation":
        return <Briefcase className="w-4 h-4" />;
      case "resources":
        return <BookOpen className="w-4 h-4" />;
      case "community":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getContextColor = () => {
    switch (contextType) {
      case "skill":
        return "bg-purple-500";
      case "occupation":
        return "bg-blue-500";
      case "resources":
        return "bg-green-500";
      case "community":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`${getContextColor()} hover:${getContextColor()}/90 w-14 h-14 rounded-full shadow-lg`}
        >
          <Bot style={{width: '28px', height: '28px'}} className="w-14 h-14 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} w-96 h-[600px] shadow-2xl transition-all duration-300 ${
          isMinimized ? "h-16" : "h-[600px]"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className={`p-1.5 rounded-full ${getContextColor()}`}>
              {getContextIcon()}
            </div>
            <span>JobCompass AI</span>
            {contextData.name && (
              <Badge variant="secondary" className="text-xs">
                {contextData.name}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!msg.isUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={`${getContextColor()} text-white`}
                        >
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.isUser
                          ? `${getContextColor()} text-white`
                          : isDark
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.isUser ? msg.message : msg.response}
                      </p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {msg.isUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={`${getContextColor()} text-white`}
                      >
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Try asking:
                </p>
                <div className="space-y-1">
                  {suggestedQuestions[contextType]
                    .slice(0, 2)
                    .map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className={`text-xs p-2 rounded-md w-full text-left hover:${getContextColor()}/10 ${
                          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        } transition-colors`}
                      >
                        {question}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about careers..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className={`${getContextColor()} hover:${getContextColor()}/90`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
