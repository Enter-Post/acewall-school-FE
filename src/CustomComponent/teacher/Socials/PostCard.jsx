import React, { useState } from "react";
import PostReactions from "./PostReactions";
import CommentSection from "./CommentSection";
import PostComments from "./PostComments";

const PostCard = ({ post, setPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const TEXT_LIMIT = 150;

  // ✅ Extract author info safely
  const author = post?.author || {};
  const authorName = `${author.firstName || ""} ${author.middleName || ""} ${author.lastName || ""
    }`.trim();

  const profilePic =
    author?.profileImg?.url ||
    author?.profileImg ||
    "https://i.pravatar.cc/100?img=10";

  const postTime = post?.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "Just now";

  // ✅ Main content
  const text = post?.text || "";
  const assets = Array.isArray(post?.assets) ? post.assets : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-all">
      {/* 🧑‍💻 Header */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={profilePic}
          alt={authorName}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-[15px]">
            {authorName || "Unknown User"}
          </h3>
          <p className="text-xs text-gray-500">{postTime}</p>
        </div>
      </div>

      {/* 📝 Text */}
      {text && (
        <div className="text-gray-800 text-[14px] py-4 leading-relaxed whitespace-pre-line">
          {showFullText || text.length <= TEXT_LIMIT
            ? text
            : `${text.slice(0, TEXT_LIMIT)}...`}
          {text.length > TEXT_LIMIT && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-blue-600 text-sm ml-1 hover:underline"
            >
              {showFullText ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* 📸 Media (supports multiple assets) */}
      {assets.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          {assets.map((asset, index) => {
            const isVideo =
              asset?.url?.endsWith(".mp4") ||
              asset?.type?.includes("video");
            return isVideo ? (
              <video
                key={index}
                controls
                className="w-full rounded-lg max-h-[300px] object-cover"
              >
                <source src={asset.url} type="video/mp4" />
              </video>
            ) : (
              <img
                key={index}
                src={asset.url}
                alt={`Post media ${index}`}
                className="w-full rounded-lg object-contain max-h-[300px]"
              />
            );
          })}
        </div>
      )}

      {/* ❤️ Reactions + 💬 Comments */}
      <PostReactions
        post={post}
        setPosts={setPosts}
        onToggleComments={() => setShowComments((prev) => !prev)}
      />

      {/* Comments Section */}
      {showComments && <PostComments postId={post._id} setPosts={setPosts} />
      }    </div>

  );
};

export default PostCard;
