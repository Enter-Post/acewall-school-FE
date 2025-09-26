import React, { useEffect, useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const LMSPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const backdropRef = useRef(null);

  const points = [
    "Specialty LMS catered to each school",
    "Efficient, User Friendly, and Cost Effective",
    "Dedicated Support Team",
    "Income Opportunities for schools and teachers just through signing-up",
    "Switch and save up to 30% off current LMS",
  ];

  useEffect(() => {
    // Delay show
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animate backdrop
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      // Animate modal
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
      );

      // Animate list items
      gsap.fromTo(
        ".feature-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          delay: 0.4,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 px-4"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-lg sm:max-w-2xl transform overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl transition-transform hover:scale-110"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-green-700 mb-4 sm:mb-6 leading-snug">
          Save up to{" "}
          <span className="text-orange-400 drop-shadow-[0_0_10px_#bef264] animate-pulse">
            30%
          </span>{" "}
          on Your Current LMS!
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-4 sm:mb-6 text-base sm:text-lg">
          Empower your institution with a smarter, more affordable learning
          platform.
        </p>

        {/* Feature list */}
        <ul className="grid grid-cols-1 gap-3 sm:gap-4 mb-6">
          {points.map((point, idx) => (
            <li key={idx} className="feature-item flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-1 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="text-gray-800 text-base sm:text-lg font-medium">
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <div className="mt-6 text-center">
          <button
            ref={(el) => {
              if (el) {
                // Hover animation with GSAP
                el.onmouseenter = () => {
                  gsap.to(el, {
                    scale: 1.08,
                    rotate: 1,
                    duration: 0.2,
                    ease: "power2.out",
                  });
                };
                el.onmouseleave = () => {
                  gsap.to(el, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.2,
                    ease: "power2.inOut",
                  });
                };
                el.onmousedown = () => {
                  gsap.to(el, {
                    scale: 0.95,
                    duration: 0.15,
                    ease: "power2.inOut",
                  });
                };
                el.onmouseup = () => {
                  gsap.to(el, {
                    scale: 1.08,
                    duration: 0.15,
                    ease: "power2.out",
                  });
                };
              }
            }}
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="group relative overflow-hidden rounded-lg w-full sm:w-auto px-6 sm:px-10 py-3 font-bold text-base sm:text-lg text-white backdrop-blur-md 
              border border-white/30 shadow-xl 
              bg-gradient-to-r from-green-700/80 to-green-800/90 hover:from-green-600 hover:to-green-700 
              transition-all duration-300"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
            </span>

            <span onClick={() => navigate("/contact")} className="relative z-10">Contact the Representative </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LMSPopup;
