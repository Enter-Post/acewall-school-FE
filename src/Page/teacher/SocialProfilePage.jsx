import React from "react";
import { ArrowLeft, Grid } from "lucide-react";
import PostCard from "@/CustomComponent/teacher/Socials/PostCard";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ posts, setPosts }) => {
  const navigate = useNavigate();

  // Filter to show only the current user's posts
  const userPosts = posts.filter(
    (post) => post.name === "You" || post.profilePic.includes("img=10")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white sticky top-0 flex items-center justify-between px-6 py-3 border-b z-10 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold tracking-wide">Your Posts</h1>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center mt-6 mb-4">
        <img
          src="https://i.pravatar.cc/100?img=10"
          alt="User"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <h2 className="mt-3 text-lg font-semibold text-gray-800">You</h2>
        <p className="text-gray-500 text-sm">{userPosts.length} Posts</p>
      </div>

      {/* Posts Grid */}
      {userPosts.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-4 px-2 sm:px-4 pb-10">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} setPosts={setPosts} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
          <Grid className="w-10 h-10 mb-2" />
          <p>No posts yet. Start sharing something!</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
