import React, { useRef } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import gsap from "gsap";

const PostReactions = ({ post, setPosts, onToggleComments }) => {
  const likeRef = useRef(null);
  const burstRef = useRef(null);

  const getRandomColor = () => {
    const colors = ["#3b82f6", "#60a5fa", "#2563eb", "#93c5fd", "#1e40af"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleLike = () => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

    // Like animation
    if (likeRef.current) {
      gsap.fromTo(
        likeRef.current,
        { scale: 0.8, rotation: 0 },
        {
          scale: 1.3,
          rotation: 10,
          duration: 0.25,
          ease: "back.out(2)",
          onComplete: () => {
            gsap.to(likeRef.current, { scale: 1, rotation: 0, duration: 0.2 });
          },
        }
      );
    }

    // Confetti burst
    if (burstRef.current && !post.liked) {
      const numParticles = 10;
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("span");
        particle.className = "absolute w-1.5 h-1.5 rounded-full";
        particle.style.backgroundColor = getRandomColor();
        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.transform = "translate(-50%, -50%)";
        burstRef.current.appendChild(particle);

        const angle = (Math.PI * 2 * i) / numParticles;
        const radius = 20 + Math.random() * 10;

        gsap.to(particle, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          opacity: 0,
          scale: 0.5 + Math.random(),
          duration: 0.6 + Math.random() * 0.4,
          ease: "power1.out",
          onComplete: () => particle.remove(),
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-between mt-3 text-gray-600 border-t pt-2">
      {/* Like button */}
      <button
        onClick={handleLike}
        className={`relative flex items-center gap-1.5 transition text-sm ${
          post.liked ? "text-blue-600" : "hover:text-blue-600"
        }`}
      >
        <span className="relative">
          <ThumbsUp
            className={`w-4 h-4 ${post.liked ? "text-blue-600" : "text-gray-600"}`}
            ref={likeRef}
          />
          <span className="absolute inset-0 pointer-events-none" ref={burstRef} />
        </span>
        <span>{post.likes > 0 ? `Like · ${post.likes}` : "Like"}</span>
      </button>

      {/* Comment button */}
      <div
        onClick={onToggleComments}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition cursor-pointer"
        id={`comment-count-${post.id}`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>
          {post.comments.length}{" "}
          {post.comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>
    </div>
  );
};

export default PostReactions;
