import { useState } from "react";
import { File, Send, X } from "lucide-react";
import { toast } from "sonner";

export default function InputBar({
  onSendMessage,
  input,
  setInput,
  file,
  setFile,
}) {

  console.log(file, "file")

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    const maxSize = 1 * 1024 * 1024; // 1MB

    // If no file selected
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only PDF, Word (.doc/.docx), and Excel (.xls/.xlsx) files are allowed."
      );
      e.target.value = "";
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error("File size must be less than 1MB.");
      e.target.value = "";
      return;
    }

    // If valid, save file
    setFile(file);
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 shadow-lg">
      <section>
        {file && (
          <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-between items-center">
            <p className="text-sm text-slate-900 dark:text-white">
              {file.name}
            </p>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <span className="sr-only">Remove</span>
              <X></X>
            </button>
          </div>
        )}
      </section>
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask any question…"
          className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <File size={20} />
          <input
            type="file"
            id="file-upload"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
          />
        </label>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white transition-colors duration-200 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
