import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";

// ✅ Zod Schema for validation
const AnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  courseId: z.string().trim().min(1, "Course is required"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(500, "Message cannot exceed 500 characters"),
});

export default function AnnouncementDialog({ open, onOpenChange, onCreated }) {
  const { user } = useContext(GlobalContext);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [messageCharCount, setMessageCharCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: "",
      courseId: "",
      message: "",
    },
  });

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      setStatusMessage("Loading courses...");
      try {
        const response = await axiosInstance.get("/course/getindividualcourse");
        setAllCourses(response.data.courses || []);
        setStatusMessage(
          `${response.data.courses?.length || 0} courses loaded`
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
        setStatusMessage("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  const onSubmit = async (data) => {
    if (!user?._id) return;

    const payload = {
      ...data,
      teacherId: user._id,
    };

    try {
      const res = await axiosInstance.post(
        "/announcements/createannouncement",
        payload
      );

      setStatusMessage(
        "Announcement created and email sent to enrolled students."
      );
      alert("✅ Announcement created and email sent to enrolled students.");

      if (onCreated) onCreated(res.data.announcement);

      onOpenChange(false);
      reset();
      setTitleCharCount(0);
      setMessageCharCount(0);
    } catch (err) {
      console.error("Error creating announcement:", err);
      setStatusMessage("Failed to create announcement. Please try again.");
      alert("❌ Failed to create announcement. Please try again.");
    }
  };

  const handleCancel = () => {
    reset();
    setTitleCharCount(0);
    setMessageCharCount(0);
    onOpenChange(false);
  };

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby="announcement-dialog-description">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription id="announcement-dialog-description">
              Create a new announcement for your students. All fields marked
              with * are required.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
            noValidate
          >
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Announcement Title <span aria-label="required">*</span>
              </Label>
              <Input
                id="title"
                maxLength={100}
                {...register("title")}
                onChange={(e) => {
                  setTitleCharCount(e.target.value.length);
                  setValue("title", e.target.value, { shouldValidate: true });
                }}
                placeholder="Enter title"
                aria-required="true"
                aria-invalid={errors.title ? "true" : "false"}
                aria-describedby={
                  errors.title ? "title-error title-count" : "title-count"
                }
                className={
                  errors.title ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              <div
                id="title-count"
                className="text-sm text-gray-600 text-right mt-1"
                aria-live="polite"
              >
                {titleCharCount}/100 characters
              </div>
              {errors.title && (
                <p
                  id="title-error"
                  className="text-sm text-red-700 font-medium mt-1"
                  role="alert"
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <Label htmlFor="course-select">
                Select Course <span aria-label="required">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("courseId", value, { shouldValidate: true })
                }
                disabled={loading}
              >
                <SelectTrigger
                  id="course-select"
                  aria-required="true"
                  aria-invalid={errors.courseId ? "true" : "false"}
                  aria-describedby={
                    errors.courseId ? "course-error" : undefined
                  }
                  className={
                    errors.courseId ? "border-red-500 focus:ring-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading courses...
                    </SelectItem>
                  ) : allCourses.length === 0 ? (
                    <SelectItem value="no-courses" disabled>
                      No courses available
                    </SelectItem>
                  ) : (
                    allCourses.map((courseData) => (
                      <SelectItem key={courseData._id} value={courseData._id}>
                        {courseData.courseTitle || "Untitled Course"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p
                  id="course-error"
                  className="text-sm text-red-700 font-medium mt-1"
                  role="alert"
                >
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">
                Announcement Message <span aria-label="required">*</span>
              </Label>
              <Textarea
                id="message"
                maxLength={500}
                rows={5}
                {...register("message")}
                onChange={(e) => {
                  setMessageCharCount(e.target.value.length);
                  setValue("message", e.target.value, { shouldValidate: true });
                }}
                placeholder="Enter message"
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={
                  errors.message
                    ? "message-error message-count"
                    : "message-count"
                }
                className={
                  errors.message ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              <div
                id="message-count"
                className="text-sm text-gray-600 text-right mt-1"
                aria-live="polite"
              >
                {messageCharCount}/500 characters
              </div>
              {errors.message && (
                <p
                  id="message-error"
                  className="text-sm text-red-700 font-medium mt-1"
                  role="alert"
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Footer Buttons */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Cancel creating announcement"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={
                  isSubmitting
                    ? "Creating announcement..."
                    : "Create announcement"
                }
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
