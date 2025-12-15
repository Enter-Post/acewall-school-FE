import React, { useState, useEffect, useRef } from "react";
import { X, Image, Video } from "lucide-react";
import gsap from "gsap";
import { axiosInstance } from "@/lib/AxiosInstance";
import JoditEditor from "jodit-react";

const CreatePostModal = ({ onClose, onCreate }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const editorRef = useRef(null);

  // Animate modal on mount
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 12, scale: 0.98, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" }
      );
    }

    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setVideo(null);
    setVideoPreview(null);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image && !video) {
      alert("Add some content first!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("assets", image);
      if (video) formData.append("assets", video);

      const response = await axiosInstance.post("posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        onCreate && onCreate(response.data.post || {});
        alert("Post created successfully!");
        setText("");
        setImage(null);
        setVideo(null);
        setImagePreview(null);
        setVideoPreview(null);
        onClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-5 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close create post"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-3">Create Post</h2>

        {/* Post Editor */}
        <div className="mb-3">
          <JoditEditor
            ref={editorRef}
            value={text}
            onChange={(value) => setText(value)}
            placeholder="What's on your mind?"
          />
        </div>

        {/* Media Preview */}
        {(imagePreview || videoPreview) && (
          <div className="mt-2">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg max-h-[200px] object-cover mb-2 w-full"
              />
            )}
            {videoPreview && (
              <video
                controls
                className="rounded-lg max-h-[200px] object-cover mb-2 w-full"
              >
                <source src={videoPreview} type="video/mp4" />
              </video>
            )}
          </div>
        )}

        {/* Upload Buttons */}
        <div className="flex items-center gap-4 mt-3 text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition">
            <Image className="w-5 h-5" />
            <span className="text-sm">Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition">
            <Video className="w-5 h-5" />
            <span className="text-sm">Video</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </label>
        </div>

        {/* Post Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;
