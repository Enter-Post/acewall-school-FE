import React, { useState, useEffect, useRef } from "react";
import { X, Image, Video, Palette } from "lucide-react";
import gsap from "gsap";

const CreatePostModal = ({ onClose, onCreate }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff"); // default background
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
    setImage(URL.createObjectURL(file));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (video) URL.revokeObjectURL(video);
    setVideo(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!text.trim() && !image && !video) {
      alert("Add some content first!");
      return;
    }

    const newPost = {
      name: "You",
      profilePic: "https://i.pravatar.cc/50?img=10",
      content: {
        text: text.trim(),
        image,
        video,
        bgColor, // ✅ include color inside content
      },
    };

    onCreate(newPost);
    setText("");
    setImage(null);
    setVideo(null);
    setBgColor("#ffffff");
  };


  const colors = [
    "#ffffff",
    "#fef3c7",
    "#e0f2fe",
    "#dcfce7",
    "#fce7f3",
    "#ede9fe",
    "#ffedd5",
  ];

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close create post"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-3">Create Post</h2>

        {/* Live Preview Box */}
        <div
          className="rounded-lg border p-3 mb-3 transition-colors duration-300"
          style={{ backgroundColor: bgColor }}
        >
          <textarea
            placeholder="What's on your mind?"
            className="w-full h-24 bg-transparent text-sm resize-none focus:outline-none placeholder-gray-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Media Preview */}
        {(image || video) && (
          <div className="mt-2">
            {image && (
              <img
                src={image}
                alt="Preview"
                className="rounded-lg max-h-[200px] object-cover mb-2 w-full"
              />
            )}
            {video && (
              <video
                controls
                className="rounded-lg max-h-[200px] object-cover mb-2 w-full"
              >
                <source src={video} type="video/mp4" />
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

        {/* Color Picker */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Background Color</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-7 h-7 rounded-full border-2 transition ${bgColor === color ? "border-green-600 scale-110" : "border-gray-200"
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => setBgColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Post Button */}
        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;
