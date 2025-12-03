import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AnnouncementList from "../../CustomComponent/teacher/Announcement/AnnouncementList";
import AnnouncementDialog from "../../CustomComponent/teacher/Announcement/AnnouncementDialog";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Loader } from "lucide-react";

export default function TeacherAnnouncement() {
  const { user } = useContext(GlobalContext);

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [currentAnnouncements, setCurrentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  // Function to fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    setStatusMessage("Loading announcements...");
    try {
      const res = await axiosInstance.get(
        `/announcements/getbyteacher/${user._id}`
      );
      const rawAnnouncements = res.data.announcements;

      const formatted = rawAnnouncements.map((item) => ({
        _id: item._id,
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        title: item.title,
        message: item.message,
      }));

      setCurrentAnnouncements(formatted);
      setStatusMessage(`${formatted.length} announcements loaded`);
    } catch (error) {
      console.error(
        "Error fetching teacher announcements:",
        error.response?.data || error.message
      );
      setStatusMessage("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAnnouncements();
    }
  }, [user?._id]);

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    try {
      await axiosInstance.delete(`/announcements/${announcementToDelete}`);
      setCurrentAnnouncements((prev) =>
        prev.filter((a) => a._id !== announcementToDelete)
      );
      setStatusMessage("Announcement deleted successfully");
    } catch (error) {
      console.error(
        "Failed to delete announcement:",
        error.response?.data || error.message
      );
      setStatusMessage("Failed to delete announcement");
    } finally {
      setShowDeleteDialog(false);
      setAnnouncementToDelete(null);
    }
  };

  // This function is called after new announcement creation
  const handleAnnouncementCreated = () => {
    fetchAnnouncements(); // Refresh announcements list
    setShowNewDialog(false); // Close the create dialog
    setStatusMessage("New announcement created successfully");
    // If you want to navigate to a specific announcement page, add router push here.
  };

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      <main id="main-content" className="mx-auto p-3 md:p-0">
        <div className="flex flex-col mb-2">
          <h1 className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
            Announcements
          </h1>
          <div className="flex justify-end">
            <Button
              className="bg-green-500 hover:bg-green-600 mb-5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => setShowNewDialog(true)}
              aria-label="Add new announcement"
            >
              + Add New
            </Button>
          </div>
        </div>

        {loading ? (
          <div
            className="flex justify-center items-center py-10"
            role="status"
            aria-label="Loading announcements"
          >
            <Loader className="animate-spin" aria-hidden="true" />
            <span className="sr-only">
              Loading announcements, please wait...
            </span>
          </div>
        ) : (
          <AnnouncementList
            title="Announcements"
            announcements={currentAnnouncements}
            onDelete={handleDeleteAnnouncement}
          />
        )}

        <AnnouncementDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onCreated={handleAnnouncementCreated}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent aria-describedby="delete-dialog-description">
            <DialogHeader>
              <DialogTitle>Delete Announcement</DialogTitle>
            </DialogHeader>
            <DialogDescription id="delete-dialog-description">
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </DialogDescription>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Cancel deletion"
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={confirmDeleteAnnouncement}
                aria-label="Confirm delete announcement"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
