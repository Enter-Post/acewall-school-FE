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
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  console.log(selectedCourse,"selected courses");
  
  // Fetch all courses
  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axiosInstance.get("/course/getindividualcourse");
        setAllCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
      }
    };
    getCourses();
  }, []);

  // Fetch announcements (optionally filtered by course)
  const fetchAnnouncements = async (courseId = "") => {
    setLoading(true);
    console.log(courseId,"courseid in fetch ");
    
    setStatusMessage("Loading announcements...");
    try {
      let url = `/announcements/getbyteacher/${user._id}`;
      if (courseId)
        url = `/announcements/getbyteacher/${user._id}?course=${courseId}`;

      const res = await axiosInstance.get(url);
      const rawAnnouncements = res.data.announcements || res.data;
      console.log(rawAnnouncements);

      // Group announcements by course
      const grouped = {};
      rawAnnouncements.forEach((a) => {
        const courseId = a.course?._id || a.courseId || "no-course";
        if (!grouped[courseId]) {
          grouped[courseId] = {
            courseId,
            courseTitle: a.course?.courseTitle || a.courseTitle || "No Course",
            thumbnail: a.course?.thumbnail || "",
            announcements: [],
          };
        }
        grouped[courseId].announcements.push({
          _id: a._id,
          date: new Date(a.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          title: a.title,
          message: a.message,
          courseTitle: a.course?.courseTitle || a.courseTitle || "No Course",
          teacher: a.teacher,
          links: a.links || [],
          attachments: a.attachments || [],
        });
      });

      setCurrentAnnouncements(Object.values(grouped));
      setStatusMessage(`${rawAnnouncements.length} announcements loaded`);
    } catch (error) {
      console.error(
        "Error fetching announcements:",
        error.response?.data || error.message
      );
      setStatusMessage("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  // Fetch announcements when user changes or selectedCourse changes
  useEffect(() => {
    if (user?._id) {
      fetchAnnouncements(selectedCourse);
    }
  }, [user?._id, selectedCourse]);

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    try {
      await axiosInstance.delete(`/announcements/${announcementToDelete}`);
      setCurrentAnnouncements((prev) =>
        prev.map((course) => ({
          ...course,
          announcements: course.announcements.filter(
            (a) => a._id !== announcementToDelete
          ),
        }))
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

  const handleAnnouncementCreated = () => {
    fetchAnnouncements(selectedCourse); // refresh announcements for the selected course
    setShowNewDialog(false);
    setStatusMessage("New announcement created successfully");
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      <main id="main-content" className="mx-auto p-3 md:p-0">
        <div className="flex flex-col mb-4">
          <h1 className="text-xl py-4 mb-4 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
            Announcements
          </h1>

          {/* Course Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <label htmlFor="courseFilter" className="font-semibold">
              Filter by Course:
            </label>
            <select
              id="courseFilter"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {allCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mb-4">
            <Button
              className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
            <Loader className="animate-spin mr-2" aria-hidden="true" />
            <span className="sr-only">
              Loading announcements, please wait...
            </span>
          </div>
        ) : currentAnnouncements.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            No announcements available.
          </div>
        ) : (
          currentAnnouncements.map((course) => (
            <div key={course.courseId} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    className="w-14 h-14 rounded-md object-cover"
                    alt={course.courseTitle}
                  />
                )}
                <h2 className="text-lg font-semibold">
                  {course.courseTitle} ({course.announcements.length})
                </h2>
              </div>

              <AnnouncementList
                title={course.courseTitle}
                announcements={course.announcements}
                onDelete={handleDeleteAnnouncement}
              />
            </div>
          ))
        )}

        {/* New Announcement Dialog */}
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
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={confirmDeleteAnnouncement}
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
