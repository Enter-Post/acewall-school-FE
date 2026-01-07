import React, { useState, useEffect, useContext, useRef } from "react";
import { PlusCircle, Coffee, User } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import PostCard from "@/CustomComponent/teacher/Socials/PostCard";
import CreatePostModal from "@/CustomComponent/teacher/Socials/CreatePostModal";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";

const SocialMain = ({ posts: externalPosts, setPosts: setExternalPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(GlobalContext);

  const posts = externalPosts || localPosts;
  const setPosts = setExternalPosts || setLocalPosts;

  const postRefs = useRef({});
  const previousPostCount = useRef(0);

  // Fetch paginated posts
  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/posts/getPosts?page=${pageNum}&limit=10`
      );
      const fetched = response.data?.posts || [];

      console.log(fetched, "fetched posts");

      const normalized = fetched.map((post) => ({
        _id: post._id,
        text: post.text || "",
        color: post.color || "#ffffff",
        assets: Array.isArray(post.assets) ? post.assets : [],
        author: {
          firstName: post?.author?.firstName || "Deleted",
          middleName: post?.author?.middleName || "",
          lastName: post?.author?.lastName || "User",
          profileImg: {
            url:
              post?.author?.profileImg?.url ||
              "https://via.placeholder.com/150",
              
          },
        },
        createdAt: post.createdAt || new Date().toISOString(),
        likes: post.likes || [],
        comments: post.comments || [],
        liked: false,
      }));

      if (pageNum === 1) {
        setPosts(normalized);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const uniqueNew = normalized.filter((p) => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });
      }

      setHasMore(fetched.length === 10);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Load more on page change
  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  // Animate new posts with GSAP
  useEffect(() => {
    const postElements = Object.values(postRefs.current).filter(Boolean);
    const newPosts = postElements.slice(previousPostCount.current);

    if (newPosts.length > 0) {
      gsap.fromTo(
        newPosts,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }

    previousPostCount.current = postElements.length;
  }, [posts]);

  // Refresh posts after creation
  const handleCreatePost = async () => {
    setIsModalOpen(false);
    await fetchPosts(1);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <header className="bg-green-600 text-white rounded-lg shadow-sm sticky top-0 flex items-center justify-between px-6 py-3 border-b ">
        <div className="flex items-center gap-3">
          <Coffee className="w-6 h-6" aria-hidden="true" />
          <h1 className="text-xl font-bold tracking-wide">Spill The Tea</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`socialprofile/${user._id}`}>
            <button
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-4 py-2 rounded-full transition text-sm font-medium"
              aria-label="Go to profile"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-5 py-2 rounded-full transition"
            aria-label="Create new post"
          >
            <PlusCircle className="w-5 h-5" />
            Create
          </button>
        </div>
      </header>

      {/* Posts List */}
      <main className="max-w-3xl mx-auto mt-6 space-y-4 px-2 sm:px-4 pb-10">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              ref={(el) => {
                if (el) postRefs.current[post._id] = el;
              }}
            >
              <PostCard post={post} setPosts={setPosts} />
            </div>
          ))
        ) : loading ? (
          <div
            role="status"
            aria-live="polite"
            className="text-center text-gray-500 py-6"
          >
            Loading posts...
          </div>
        ) : (
          <div className="text-center text-gray-500 py-6">No posts found</div>
        )}

        {loading && posts.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="text-center text-gray-500 py-6"
          >
            Loading more posts...
          </div>
        )}
      </main>

      {/* Create Post Modal */}
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
