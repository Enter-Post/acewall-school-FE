import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteModal({
  chapterID,
  deleteFunc,
  what = "item",
  onSuccess,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteFunc(chapterID);
      setOpen(false);
      toast.success(`${what} deleted successfully`);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Failed to delete ${what}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      aria-label={`Delete ${what} dialog`}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Delete ${what}`}
          className="h-8 text-gray-500 hover:text-red-600 bg-gray-200 hover:bg-red-200 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-red-500"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        role="alertdialog"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {what}.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                Deleting...
              </span>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
