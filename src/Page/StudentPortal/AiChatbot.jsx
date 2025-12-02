"use client"

import { useState, useRef, useEffect } from "react"

// Assuming these are the correct paths to your components
import ChatWindow from "@/CustomComponent/Aichatbot/ChatWindow"
import InputBar from "@/CustomComponent/Aichatbot/InputBar"
import RightPanel from "@/CustomComponent/Aichatbot/RightPanel"

export default function AiChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Educational Assistant. I'm here to help you learn about any subject. What would you like to explore today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ])
  const [difficulty, setDifficulty] = useState("medium")
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text) => {
    if (!text.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = {
        easy: [
          "That's a great question! Let me explain this in simple terms...",
          "Good thinking! Here's how we can break this down...",
          "Excellent question! The basic idea is...",
        ],
        medium: [
          "That's an interesting point. Let me provide a comprehensive answer...",
          "Great question! This involves several important concepts...",
          "Let me dive deeper into this topic...",
        ],
        hard: [
          "That's a sophisticated question! Let's analyze this at an advanced level...",
          "Excellent inquiry! This requires understanding several interconnected concepts...",
          "Let me provide an in-depth analysis of this complex topic...",
        ],
      }

      const responses = aiResponses[difficulty]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 800)
  }

  const handleFollowUpQuestion = (question) => {
    handleSendMessage(question)
  }

  const handleDownloadPDF = () => {
    alert("PDF download feature coming soon! This would export the conversation.")
  }

  const handleDownloadWord = () => {
    alert("Word download feature coming soon! This would export the conversation.")
  }

  return (
    // Updated container to be flexible for mobile: uses 'flex-col' by default (mobile)
    // and 'lg:flex-row' for desktop screens.
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      
      {/* Main Chat Area */}
      {/* On large screens (lg), it flexes to take available space. 
          On small screens, it takes full width and all available height, 
          ensuring the chat is visible first. */}
      <main
        className="flex-1 flex flex-col min-h-0 order-1 lg:order-none"
        role="main"
        aria-label="Chat with AI Educational Assistant"
      >
        {/* Header */}
        <header className=" bg-green-600 dark:bg-slate-950 px-6 py-4 shadow-md sticky top-0 rounded-xl ">
          <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white">
            AI Educational Assistant
          </h1>
        </header>

        {/* Chat Window: Added flex-1 and overflow-y-auto to allow the window to scroll 
            and take all remaining vertical space. */}
        <section
          className="flex-1 overflow-y-auto"
          aria-label="Conversation"
        >
          {/* Note: Ensure your ChatWindow component handles its own internal padding/margin */}
          <ChatWindow messages={messages} chatEndRef={chatEndRef} />
        </section>

        {/* Input Bar: Uses padding to keep input away from edges */}
        <div className="p-4 bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700">
            <InputBar onSendMessage={handleSendMessage} />
        </div>
      </main>

      {/* Right Panel */}
      {/* On large screens (lg), it takes a specific width (e.g., w-80). 
          On small screens, it takes full width (w-full) and is placed second (order-2) 
          so it appears below the chat when stacked. */}
      <aside 
        className=" bg-slate-100 dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-800 p-4 "
        role="complementary"
        aria-label="Chat Settings and Options"
      >
        <RightPanel
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onFollowUpQuestion={handleFollowUpQuestion}
          onDownloadPDF={handleDownloadPDF}
          onDownloadWord={handleDownloadWord}
        />
      </aside>
    </div>
  )
}