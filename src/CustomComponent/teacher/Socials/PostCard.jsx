import React, { useState } from "react";
import PostReactions from "./PostReactions";
import PostComments from "./PostComments";
import { axiosInstance } from "@/lib/AxiosInstance";
import DeleteConfirmDialog from "./DeletePostModal";
import avatar from "../../../assets/avatar.png";

const PostCard = ({ post, setPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const location = window.location.pathname;

  const TEXT_LIMIT = 150;

  // Author info safely
  const author = post?.author || {};
  const authorName = `${author.firstName || ""} ${author.middleName || ""} ${
    author.lastName || ""
  }`.trim();
  const profilePic = author?.profileImg?.includes("placeholder")
    ? avatar
    : author?.profileImg;

  const postTime = post?.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "Just now";

  const assets = Array.isArray(post?.assets) ? post.assets : [];

  // Strip HTML tags from text
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const text = stripHtml(post?.text || "");

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      await axiosInstance.delete(`/posts/deletePost/${post._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <article
      className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-all"
      aria-label={`Post by ${authorName || "Unknown User"}`}
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={profilePic || avatar}
            alt={authorName || "Unknown User"}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900 text-[15px]">
              {authorName || "Unknown User"}
            </h2>
            <time
              dateTime={post?.createdAt || new Date().toISOString()}
              className="text-xs text-gray-500"
            >
              {postTime}
            </time>
          </div>
        </div>

        {location.includes("/socialprofile/") && (
          <DeleteConfirmDialog onDelete={handleDeletePost} />
        )}
      </header>

      {/* Text */}
      {text && (
        <p
          className="text-gray-800 text-[14px] py-4 leading-relaxed whitespace-pre-line"
          aria-label="Post content"
        >
          {showFullText || text.length <= TEXT_LIMIT
            ? text
            : `${text.slice(0, TEXT_LIMIT)}...`}
          {text.length > TEXT_LIMIT && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-blue-600 text-sm ml-1 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-expanded={showFullText}
              aria-controls={`post-text-${post._id}`}
            >
              {showFullText ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}

      {/* Media */}
      {assets.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          {assets.map((asset, index) => {
            const isVideo =
              asset?.url?.endsWith(".mp4") || asset?.type?.includes("video");
            return isVideo ? (
              <video
                key={index}
                controls
                className="w-full rounded-lg max-h-[300px] object-cover"
                aria-label={`Video post media ${index + 1}`}
              >
                <source src={asset.url} type="video/mp4" />
              </video>
            ) : (
              <img
                key={index}
                src={asset.url}
                alt={`Post media ${index + 1}`}
                className="w-full rounded-lg object-contain max-h-[300px]"
              />
            );
          })}
        </div>
      )}

      {/* Reactions + Comments toggle */}
      <PostReactions
        post={post}
        setPosts={setPosts}
        onToggleComments={() => setShowComments((prev) => !prev)}
      />

      {/* Comments Section */}
      {showComments && (
        <section
          id={`comments-${post._id}`}
          aria-label="Comments section"
          tabIndex={-1} // focusable for screen readers
        >
          <PostComments postId={post._id} setPosts={setPosts} />
        </section>
      )}
    </article>
  );
};

export default PostCard;
