import React, { useState, useEffect, useRef } from "react";
import { X, Image, Video } from "lucide-react";
import gsap from "gsap";
import { axiosInstance } from "@/lib/AxiosInstance";
import JoditEditor from "jodit-react";

const CreatePostModal = ({ onClose, onCreate }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 12, scale: 0.98, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" }
      );
    }

    return () => {
      if (image) URL.revokeObjectURL(image);
      if (video) URL.revokeObjectURL(video);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (image) URL.revokeObjectURL(image);
    setImage(file);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (video) URL.revokeObjectURL(video);
    setVideo(file);
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
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-5 relative"
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close create post"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-3">Create Post</h2>

        {/* 📝 Post Text */}
        {/* <div className="rounded-lg border p-3 mb-3 bg-white">
          <textarea
            placeholder="What's on your mind?"
            className="w-full h-24 bg-transparent text-sm resize-none focus:outline-none placeholder-gray-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div> */}
        <JoditEditor
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => {
            setText(e)
          }}
        />

        {/* 📸 Media Preview */}
        {(image || video) && (
          <div className="mt-2">
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="rounded-lg max-h-[200px] object-cover mb-2 w-full"
              />
            )}
            {video && (
              <video
                controls
                className="rounded-lg max-h-[200px] object-cover mb-2 w-full"
              >
                <source src={URL.createObjectURL(video)} type="video/mp4" />
              </video>
            )}
          </div>
        )}

        {/* 📂 Upload Buttons */}
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

        {/* ✅ Post Button */}
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