import ChatWindow from "@/CustomComponent/MessagesCmp.jsx/chat-window";
import ConversationList from "@/CustomComponent/MessagesCmp.jsx/conversation-list";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";

const Messages = () => {
  return (
    <div className="md:p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold py-4 px-6 mb-6 bg-acewall-main text-white rounded-xl shadow-md">
        Messages
      </h1>

      {/* Main container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl">
          <div className="flex h-full w-full">
            <div className="h-full w-full">
              <ConversationList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
