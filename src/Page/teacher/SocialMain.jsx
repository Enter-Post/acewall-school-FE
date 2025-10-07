import React, { useState } from "react";
import { PlusCircle, Coffee, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "@/CustomComponent/teacher/Socials/PostCard";
import CreatePostModal from "@/CustomComponent/teacher/Socials/CreatePostModal";

const SocialMain = ({ posts: externalPosts, setPosts: setExternalPosts }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use external posts if passed from parent (App.jsx), else local state fallback
  const [localPosts, setLocalPosts] = useState([
    {
      id: 1,
      name: "John Doe",
      profilePic: "https://i.pravatar.cc/50?img=1",
      time: "2 hrs ago",
      content: {
        text: "Just enjoying a beautiful day at the beach! 🌊☀️",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        video: null,
      },
      liked: false,
      likes: 3,
      comments: [
        { id: 11, name: "Anna", text: "Nice shot!", time: "1 hr" },
        { id: 12, name: "Sam", text: "Love it 🌊", time: "30 min" },
      ],
    },
    {
      id: 2,
      name: "Emily Clark",
      profilePic: "https://i.pravatar.cc/50?img=2",
      time: "Yesterday",
      content: {
        text: "Had an amazing dinner last night 🍝✨",
        image: null,
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      liked: false,
      likes: 1,
      comments: [],
    },
  ]);

  const posts = externalPosts || localPosts;
  const setPosts = setExternalPosts || setLocalPosts;

  const handleCreatePost = (newPost) => {
    const post = {
      id: Date.now(),
      name: newPost.name || "You",
      profilePic: newPost.profilePic || "https://i.pravatar.cc/50?img=10",
      time: "Just now",
      content: {
        text: newPost.content?.text || "",
        image: newPost.content?.image || null,
        video: newPost.content?.video || null,
        bgColor: newPost.content?.bgColor || null,
      },
      liked: false,
      likes: 0,
      comments: [],
    };

    setPosts((prev) => [post, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔝 Navbar */}
      <div className="bg-green-600 text-white rounded-lg shadow-sm sticky top-0 flex items-center justify-between px-6 py-3 border-b z-10">
        <div className="flex items-center gap-3">
          <Coffee className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wide">Spill The Tea</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* 👤 Profile Button */}
          <Link to="/socialprofile">
            <button
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-4 py-2 rounded-full transition text-sm font-medium"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </Link>
         

          {/* ➕ Create Post Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-5 py-2 rounded-full transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* 🧾 Posts Feed */}
      <div className="max-w-3xl mx-auto mt-6 space-y-4 px-2 sm:px-4 pb-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} setPosts={setPosts} />
        ))}
      </div>

      {/* ✏️ Create Post Modal */}
      {isModalOpen && (
        <CreatePostModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreatePost}
        />
      )}
    </div>
  );
};

export default SocialMain;
