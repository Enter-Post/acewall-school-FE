"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

/**
 * AddMoreFile
 *
 * - lessonId: id of the lesson to add files to
 * - fetchChapterDetail: callback to refresh parent data after successful upload
 *
 * Notes:
 * - server total size (prev) fetched from `lesson/getallFilesofLesson/${lessonId}`
 *   must return `totalSizeinMB` (number) or `totalSizeInBytes` — we handle both variants.
 */

const MAX_TOTAL_BYTES = 5 * 1024 * 1024; // 5 MB

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
};

const AddMoreFile = ({ lessonId, fetchChapterDetail }) => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Array<File>
  const [prevSizeBytes, setPrevSizeBytes] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch previously uploaded total size (in bytes)
  const prevFiles = async () => {
    try {
      const res = await axiosInstance.get(`lesson/getallFilesofLesson/${lessonId}`);
      // API might return totalSizeinMB or totalSizeInBytes; handle both.
      const mb = res.data?.totalSizeinMB;
      const bytes = res.data?.totalSizeInBytes;
      if (typeof bytes === "number") {
        setPrevSizeBytes(bytes);
      } else if (typeof mb === "number") {
        setPrevSizeBytes(Math.round(mb * 1024 * 1024));
      } else {
        // fallback: try to parse or assume 0
        setPrevSizeBytes(0);
      }
    } catch (err) {
      console.error("Error fetching previous files size:", err);
      setPrevSizeBytes(0);
    }
  };

  useEffect(() => {
    if (lessonId) prevFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Helper to compute total size of selected files in bytes
  const getSelectedBytes = (filesArray) =>
    filesArray.reduce((acc, f) => acc + (f?.size || 0), 0);

  // Remaining bytes allowed
  const selectedBytes = getSelectedBytes(selectedFiles);
  const totalBytes = prevSizeBytes + selectedBytes;
  const remainingBytes = Math.max(0, MAX_TOTAL_BYTES - prevSizeBytes);

  // Handle file(s) input change (accept multiple)
  const handleFileChange = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    // Convert FileList to Array
    const incoming = Array.from(fileList);

    // Validate types and size individually before adding
    for (const f of incoming) {
      if (f.type !== "application/pdf") {
        toast.error(`${f.name} is not a PDF.`);
        return;
      }
    }

    // Compute prospective new total
    const incomingBytes = getSelectedBytes(incoming);
    const prospectiveSelected = [...selectedFiles, ...incoming];
    const prospectiveSelectedBytes = getSelectedBytes(prospectiveSelected);
    const prospectiveTotal = prevSizeBytes + prospectiveSelectedBytes;

    if (prospectiveTotal > MAX_TOTAL_BYTES) {
      const allowedBytes = MAX_TOTAL_BYTES - prevSizeBytes - getSelectedBytes(selectedFiles);
      toast.error(
        `Cannot add files — total would exceed 5 MB. You can add up to ${formatBytes(
          allowedBytes > 0 ? allowedBytes : 0
        )} more.`
      );
      return;
    }

    // Append new files
    setSelectedFiles(prospectiveSelected);
  };

  // Remove single file by index
  const handleRemoveFile = (index) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one PDF to upload.");
      return;
    }

    // Final size check (server-side safety)
    const finalTotal = prevSizeBytes + getSelectedBytes(selectedFiles);
    if (finalTotal > MAX_TOTAL_BYTES) {
      toast.error("Total files exceed the 5 MB limit. Remove some files and try again.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("pdfFiles", file));

    setLoading(true);
    try {
      const res = await axiosInstance.put(`/lesson/addMoreFiles/${lessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data?.message || "Files added successfully");
      // refresh parent & prev size
      setSelectedFiles([]);
      await fetchChapterDetail?.();
      await prevFiles();
      setOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.response?.data?.message || "Failed to upload files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 text-blue-600 cursor-pointer">
          <Plus size={12} />
          <p className="text-sm">Add</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Files</DialogTitle>
          <DialogDescription>
            Upload only PDF files. Combined total (existing + new) must not exceed 5 MB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <Input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
            />

            {/* Selected Files */}
            <div className="space-y-2">
              {selectedFiles.length === 0 ? (
                <div className="text-sm text-gray-500">No files selected</div>
              ) : (
                selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-800 truncate max-w-[300px]">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Size summary */}
            <div className="text-sm text-gray-600">
           
              <div>
                Selected files: <strong>{formatBytes(selectedBytes)}</strong>
              </div>
              <div>
                Total after upload:{" "}
                <strong className={totalBytes > MAX_TOTAL_BYTES ? "text-red-600" : ""}>
                  {formatBytes(totalBytes)}
                </strong>{" "}
                / 5 MB
              </div>
              <div className="text-xs text-gray-500">
                You can add up to:{" "}
                <strong>
                  {formatBytes(Math.max(0, MAX_TOTAL_BYTES - prevSizeBytes - selectedBytes))}
                </strong>{" "}
                more in this selection.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedFiles([]);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedFiles.length === 0 || totalBytes > MAX_TOTAL_BYTES}
            >
              {loading ? "Adding..." : "Add Files"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoreFile;
