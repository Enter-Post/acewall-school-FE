"use client";

import { useState, useRef, useEffect } from "react";
import ChatWindow from "@/CustomComponent/Aichatbot/ChatWindow";
import InputBar from "@/CustomComponent/Aichatbot/InputBar";
import RightPanel from "@/CustomComponent/Aichatbot/RightPanel";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function AiChatbot() {
  const [messages, setMessages] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Load chat from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem("ai_chat_history");
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setMessages(parsed.messages || []);
      setSuggestedQuestions(parsed.suggestions || []);
    } else {
      // Default greeting
      setMessages([
        {
          id: 1,
          text:
            "Hello! I'm your AI Educational Assistant. I'm here to help you learn about any subject. What would you like to explore today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save to localStorage whenever changes happen
  const saveToLocalStorage = (msgs, suggestions) => {
    localStorage.setItem(
      "ai_chat_history",
      JSON.stringify({
        messages: msgs,
        suggestions: suggestions,
      })
    );
  };

  // ------------ MAIN SEND FUNCTION (API INTEGRATION) -------------
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Show loading state
    setLoading(true);
    const loadingMessage = {
      id: Date.now() + 1,
      text: "🤔...",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true, // custom flag
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const res = await axiosInstance.post("/aichat/ask", {
        question: text,
        difficulty,
      });

      // Remove loading message
      setMessages((prev) => prev.filter((m) => !m.isLoading));

      const aiMessage = {
        id: Date.now() + 2,
        text: res.data.answer,
        sender: "ai",
        timestamp: new Date(),
        suggestions: res.data.suggestedQuestions,
      };

      const newMessageList = [...updatedMessages, aiMessage];
      setMessages(newMessageList);
      setSuggestedQuestions(res.data.suggestedQuestions || []);

      // Save chat
      saveToLocalStorage(newMessageList, res.data.suggestedQuestions);
    } catch (error) {
      console.error("AI API Error:", error);

      // Remove loading message
      setMessages((prev) => prev.filter((m) => !m.isLoading));

      const errorMessage = {
        id: Date.now() + 3,
        text: "Oops! Something went wrong while contacting the AI.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // When clicking follow-up question
  const handleFollowUpQuestion = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1 flex flex-col min-h-0 order-1 lg:order-none">
        <header className="bg-green-600 dark:bg-slate-950 px-6 py-4 shadow-md sticky top-0 rounded-xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            AI Educational Assistant
          </h1>
        </header>

        <section className="flex-1 overflow-y-auto">
          <ChatWindow messages={messages} chatEndRef={chatEndRef} />
        </section>

        <div className="p-4 bg-white dark:bg-slate-800 shadow-lg border-t">
          <InputBar onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </main>

      {/* PASS suggestions HERE */}
      <aside className="bg-slate-100 dark:bg-slate-900 shadow-xl border-l p-4">
        <RightPanel
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onFollowUpQuestion={handleFollowUpQuestion}
          suggestions={suggestedQuestions}
        />
      </aside>
    </div>
  );
}
