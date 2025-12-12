import { GlobalContext } from "@/Context/GlobalProvider";
import { formatDistanceToNow } from "date-fns";
import { Forward } from "lucide-react";
import { useContext } from "react";

export default function ChatMessage({ message, loading }) {
  const isUser = message.sender === "user";
  const { taggedMessage, setTaggedMessage } = useContext(GlobalContext);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <Forward onClick={() => setTaggedMessage(message)} />
        {loading && (
          <span
            className={`text-xs mt-1 ${
              isUser
                ? "text-slate-500 dark:text-slate-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}
