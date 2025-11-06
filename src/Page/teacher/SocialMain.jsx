import React, { useState, useEffect, useContext } from "react";
import { PlusCircle, Coffee, User } from "lucide-react";
import { Link } from "react-router-dom";
import PostCard from "@/CustomComponent/teacher/Socials/PostCard";
import CreatePostModal from "@/CustomComponent/teacher/Socials/CreatePostModal";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";

const SocialMain = ({ posts: externalPosts, setPosts: setExternalPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(GlobalContext);

  const posts = externalPosts || localPosts;
  const setPosts = setExternalPosts || setLocalPosts;

  // ✅ Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/posts/getPosts?page=1&limit=10`);
      const fetched = response.data?.posts || [];

      // ✅ Normalize data
      const normalized = fetched.map((post) => ({
        _id: post._id,
        text: post.text || "",
        color: post.color || "#ffffff",
        assets: Array.isArray(post.assets) ? post.assets : [],
        author: {
          firstName: post?.author?.firstName || "Unknown",
          middleName: post?.author?.middleName || "",
          lastName: post?.author?.lastName || "",
          profileImg:
            post?.author?.profileImg?.url ||
            "https://i.pravatar.cc/100?img=10",
        },
        createdAt: post.createdAt || new Date().toISOString(),
        likes: post.likes || [],
        comments: post.comments || [],
        liked: false,
      }));

      setPosts(normalized);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ After post creation, refresh posts
  const handleCreatePost = async () => {
    setIsModalOpen(false);
    await fetchPosts();
  };

  return (
    <div className="min-h-screen bg-blue-300">
      {/* 🔝 Navbar */}
      <div className="bg-green-600 text-white rounded-lg shadow-sm sticky top-0 flex items-center justify-between px-6 py-3 border-b ">
        <div className="flex items-center gap-3">
          <Coffee className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wide">Spill The Tea</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* 👤 Profile */}
          <Link to={`socialprofile/${user._id}`}>
            <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-4 py-2 rounded-full transition text-sm font-medium">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </Link>

          {/* ➕ Create */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-5 py-2 rounded-full transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* 🧾 Posts */}
      <div className="max-w-3xl mx-auto mt-6 space-y-4 px-2 sm:px-4 pb-10">
        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} setPosts={setPosts} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">No posts found</div>
        )}
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