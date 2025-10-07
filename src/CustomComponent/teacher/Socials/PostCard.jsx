import React, { useState } from "react";
import PostReactions from "./PostReactions";
import CommentSection from "./CommentSection";

const PostCard = ({ post, setPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const TEXT_LIMIT = 150;


  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-all"
      style={{ backgroundColor: post.content.bgColor || "#fff" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <img src={post.profilePic} alt={post.name} className="w-9 h-9 rounded-full" />
        <div>
          <h3 className="font-semibold text-gray-900 text-[15px]">{post.name}</h3>
          <p className="text-xs text-gray-500">{post.time}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {post.content.text && (
          <div className="text-gray-800 text-[14px] py-6 leading-relaxed whitespace-pre-line">
            {showFullText || post.content.text.length <= TEXT_LIMIT
              ? post.content.text
              : `${post.content.text.slice(0, TEXT_LIMIT)}...`}

            {post.content.text.length > TEXT_LIMIT && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-blue-600 text-sm ml-1 hover:underline"
              >
                {showFullText ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {post.content.image && (
          <img
            src={post.content.image}
            alt="Post"
            className="w-full rounded-lg object-contain  max-h-[280px]"
          />
        )}
        {post.content.video && (
          <video controls className="w-full rounded-lg max-h-[280px]">
            <source src={post.content.video} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Reactions + Comments */}
      <PostReactions
        post={post}
        setPosts={setPosts}
        onToggleComments={() => setShowComments((prev) => !prev)}
      />

      {showComments && <CommentSection post={post} setPosts={setPosts} />}
    </div>
  );
};

export default PostCard;
