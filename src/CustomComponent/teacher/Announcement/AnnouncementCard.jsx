import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Megaphone, Trash2 } from "lucide-react";

export default function AnnouncementCard({ announcement, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-b">
        <td className="p-4 text-gray-700 whitespace-nowrap">{announcement.date}</td>

        <td
          className="p-4 text-indigo-500 flex items-center max-w-xs cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Megaphone className="h-4 w-4 mr-2 text-indigo-400" />
          <span className="truncate max-w-[300px]" title={announcement.title}>
            {announcement.title}
          </span>
        </td>

        <td
          className="p-4 text-gray-700 max-w-md cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="truncate block max-w-[400px]" title={announcement.message}>
            {announcement.message}
          </span>
        </td>

        <td className="p-4 flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500"
            onClick={() => onDelete?.(announcement._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-indigo-600">
              {announcement.title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 whitespace-pre-line mt-4">{announcement.message}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
