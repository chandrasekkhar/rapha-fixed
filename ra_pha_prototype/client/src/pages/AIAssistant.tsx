import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface Message {
  role: "user" | "assistant";
  content: string | any;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm RA-PHA, your AI Health Assistant. I can help you understand your health metrics, provide personalized wellness recommendations, and answer health-related questions. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.ai.chatWithAI.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        message: userMessage,
        conversationHistory: messages
      });

      const assistantContent = typeof response === "string" ? response : JSON.stringify(response);
      setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQuestions = [
    "What does my heart rate of 72 bpm indicate?",
    "How can I improve my sleep quality?",
    "What are the normal blood pressure ranges?",
    "Can you suggest a fitness plan for beginners?"
  ];

  const handleExampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Health Assistant
          </h1>
          <p className="text-gray-600 mt-2">Chat with your personalized health AI powered by advanced LLM</p>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>RA-PHA Assistant</CardTitle>
            <CardDescription>Real-time AI health insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Example Questions */}
        {messages.length === 1 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Try asking about:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleQuestion(question)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your health..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This AI assistant provides general health information and wellness recommendations. It is not a substitute for professional medical advice. Always consult with a healthcare professional for serious health concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
