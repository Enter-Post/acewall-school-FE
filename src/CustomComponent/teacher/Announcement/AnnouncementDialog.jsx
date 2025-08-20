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

  courseId: z
    .string()
    .trim()
    .min(1, "Course is required"),

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
      try {
        const response = await axiosInstance.get("/course/getindividualcourse");
        setAllCourses(response.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
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

      alert("✅ Announcement created and email sent to enrolled students.");

      if (onCreated) onCreated(res.data.announcement);

      onOpenChange(false);
      reset();
      setTitleCharCount(0);
      setMessageCharCount(0);
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("❌ Failed to create announcement. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
          <DialogDescription>
            Create a new announcement for your students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Announcement Title *</Label>
            <Input
              id="title"
              maxLength={100}
              {...register("title")}
              onChange={(e) => {
                setTitleCharCount(e.target.value.length);
                setValue("title", e.target.value, { shouldValidate: true });
              }}
              placeholder="Enter title"
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {titleCharCount}/100 characters
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <Label htmlFor="course">Select Course *</Label>
            <Select
              onValueChange={(value) =>
                setValue("courseId", value, { shouldValidate: true })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem disabled>Loading courses...</SelectItem>
                ) : allCourses.length === 0 ? (
                  <SelectItem disabled>No courses available</SelectItem>
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
              <p className="text-sm text-red-500">{errors.courseId.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Announcement Message *</Label>
            <Textarea
              id="message"
              maxLength={500}
              {...register("message")}
              onChange={(e) => {
                setMessageCharCount(e.target.value.length);
                setValue("message", e.target.value, { shouldValidate: true });
              }}
              placeholder="Enter message"
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {messageCharCount}/500 characters
            </div>
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Footer Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setTitleCharCount(0);
                setMessageCharCount(0);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
