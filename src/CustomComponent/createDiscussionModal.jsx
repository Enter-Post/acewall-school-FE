import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/AxiosInstance";
import { File, Image, Loader } from "lucide-react";
import { toast } from "sonner";
import StrictDatePicker from "./Assessment/DueDatePicker";
import { useSearchParams } from "react-router-dom";
import CategoryDropdown from "./Assessment/Assessment-category-dropdown";

export function CreateDiscussionDialog({
  refresh,
  setRefresh,
  semester,
  quarter,
}) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const typeId = searchParams.get("typeId");
  const courseId = searchParams.get("course");

  const form = useForm({
    defaultValues: {
      topic: "",
      description: "",
      totalPoints: "",
      category: "", // 🔹 Added
      dueDate: null,
    },
  });

  console.log(form.formState.errors, "errors");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPEG, JPG, and PDF files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must not exceed 2MB.");
      return;
    }

    if (files.length >= 5) {
      toast.error("You can only upload a maximum of 5 files.");
      return;
    }

    setFiles((prev) => [...prev, file]);
  };

  useEffect(() => {
    form.register("category", { required: "Category is required" });
  }, [form]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("topic", data.topic);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("type", type);
    formData.append("dueDate", JSON.stringify(data.dueDate));
    formData.append("totalMarks", data.totalPoints);
    formData.append("semester", semester);
    formData.append("quarter", quarter);
    if (type === "chapter") {
      formData.append("chapter", typeId);
    }
    if (type === "lesson") {
      formData.append("lesson", typeId);
    }
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
    }

    setRefresh(true);
    axiosInstance
      .post("/discussion/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        setRefresh(false);
        form.reset();
        setOpen(false);
      })
      .catch((err) => {
        setRefresh(false);
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          Create Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                {...form.register("topic", { required: "Topic is required" })}
              />
              {form.formState.errors.topic && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.topic.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                {...form.register("description", {
                  required: "Description is required",
                })}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <section className="flex gap-4">
              <div>
                <Label htmlFor="totalPoints">Total Points</Label>
                <Input
                  type={"number"}
                  id="totalPoints"
                  {...form.register("totalPoints", {
                    required: "Total Points is required",
                    validate: (value) =>
                      value >= 0 || "Total Points must be greater than 0",
                  })}
                />
                {form.formState.errors.totalPoints && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.totalPoints.message}
                  </p>
                )}
              </div>

              <div className="">
                <Label htmlFor="category">Category</Label>
                <CategoryDropdown
                  courseId={courseId}
                  value={form.watch("category")}
                  onValueChange={(val) =>
                    form.setValue("category", val, { shouldValidate: true })
                  }
                  error={form.formState.errors.category}
                />
                {form.formState.errors.category && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="font-semibold mb-2">Due Date</Label>
                <StrictDatePicker name="dueDate" />
              </div>
            </section>

            <div>
              <Label htmlFor="file">
                Attach File (Only PNG, JPEG, JPG, and PDF files are allowed.)
              </Label>
              <Input type="file" id="file" onChange={handleFileChange} />
              <div className="flex flex-col gap-2 mt-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-lg border-gray-300 flex items-center gap-2"
                  >
                    {file.type === "application/pdf" ? (
                      <File className="text-green-500" />
                    ) : (
                      <Image className="text-green-500" />
                    )}
                    <p className="text-sm">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={refresh}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {refresh ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Create Discussion"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
