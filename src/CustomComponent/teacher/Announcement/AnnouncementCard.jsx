import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Megaphone, Trash2 } from "lucide-react";

export default function AnnouncementCard({ announcement, onDelete, rowIndex }) {
  const [open, setOpen] = useState(false);

  const handleTitleClick = () => {
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-gray-700 whitespace-nowrap">
          {announcement.date}
        </td>

        <td className="p-4">
          <button
            onClick={handleTitleClick}
            onKeyDown={handleKeyDown}
            className="text-indigo-600 flex items-center max-w-xs hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded transition-colors"
            aria-label={`View announcement: ${announcement.title}`}
          >
            <Megaphone
              className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="truncate max-w-[300px] text-left">
              {announcement.title}
            </span>
          </button>
        </td>

        <td className="p-4">
          <button
            onClick={handleTitleClick}
            onKeyDown={handleKeyDown}
            className="text-gray-700 w-full text-left hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded transition-colors"
            aria-label={`View full message for: ${announcement.title}`}
          >
            <span className="truncate block max-w-[400px]">
              {announcement.message}
            </span>
          </button>
        </td>

        <td className="p-4">
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => onDelete?.(announcement._id)}
              aria-label={`Delete announcement: ${announcement.title}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </td>
      </tr>

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="announcement-message">
          <DialogHeader>
            <DialogTitle className="text-indigo-600">
              {announcement.title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <p
              id="announcement-message"
              className="text-gray-700 whitespace-pre-line mt-4"
            >
              {announcement.message}
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
