import React from "react";
import { format } from "date-fns";
import { X } from "lucide-react"; // modern minimal icon

const MotivationToast = ({ pendingCount, nearestDueDate, onClose }) => {
  return (
    <div
      className="relative w-80 p-4 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-green-50 
                 border border-blue-100 animate-in fade-in slide-in-from-right-5 duration-300"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200 transition"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>

      <div className="flex items-start gap-3">
        <div className="text-3xl">🌟</div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-lg">Keep Going!</p>

          <p className="text-sm text-gray-700 mt-1">
            You have{" "}
            <span className="font-semibold text-blue-700">
              {pendingCount} pending assessment
              {pendingCount !== 1 ? "s" : ""}
            </span>
            {nearestDueDate && (
              <>
                <br />
                Next due on{" "}
                <span className="font-medium text-green-700">
                  {format(nearestDueDate, "MMM dd, yyyy")}
                </span>
              </>
            )}
          </p>

          <p className="text-xs text-gray-500 mt-2 italic">
            You're doing amazing — one step at a time 💪
          </p>

          {/* progress bar */}
          <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 animate-progressBar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationToast;
