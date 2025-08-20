"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

import JoditEditor from "jodit-react";

// Zod schema
const lessonSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(5, "Description is too short").max(5000),
  youtubeLinks: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) =>
        !val ||
        /^https:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/)[\w-]{11}(&[^ ]*)?|youtu\.be\/[\w-]{11}(\?[^ ]*)?)$/.test(
          val
        ),
      {
        message: "Enter a valid YouTube video link",
      }
    ),
  otherLink: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^https?:\/\/.+$/.test(val), {
      message: "Must be a valid URL",
    }),
});

const EditLessonModal = ({ lesson, fetchChapterDetail }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(lesson.description || "");

  const editor = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      description: lesson.description || "",
      youtubeLinks: lesson.youtubeLinks || "",
      otherLink: lesson.otherLink || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", description); // Use editor state
    formData.append("youtubeLinks", data.youtubeLinks || "");
    formData.append("otherLink", data.otherLink || "");

    try {
      const res = await axiosInstance.put(
        `lesson/edit/${lesson._id}`,
        formData
      );
      toast.success(res.data.message);
      fetchChapterDetail();
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 ml-auto"
        >
          <Pen size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>
            Fill in the lesson details. Upload only PDF files, max 5MB total.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Lesson Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description (Jodit) */}
          <div>
            <Label htmlFor="description">Lesson Description</Label>
            <JoditEditor
              ref={editor}
              value={description}
              onBlur={(newContent) => setDescription(newContent)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* YouTube Link */}
          <div>
            <Label htmlFor="youtubeLinks">YouTube Link</Label>
            <Input id="youtubeLinks" {...register("youtubeLinks")} />
            {errors.youtubeLinks && (
              <p className="text-red-500 text-sm">
                {errors.youtubeLinks.message}
              </p>
            )}
          </div>

          {/* Other Link */}
          <div>
            <Label htmlFor="otherLink">Other Link</Label>
            <Input id="otherLink" {...register("otherLink")} />
            {errors.otherLink && (
              <p className="text-red-500 text-sm">
                {errors.otherLink.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setDescription(lesson.description || "");
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonModal;