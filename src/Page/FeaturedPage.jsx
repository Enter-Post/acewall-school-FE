import React, { useState } from "react";
import teacherpic from "../assets/TeacherPic.png";
import bgvideo from "../assets/bg.mp4";

import stppic from "../assets/std.png";
import blackboard from "../assets/blackboard.png";
import { Link, useNavigate } from "react-router-dom";
import { StackedCard } from "@/CustomComponent/FeatureContent";
import Popup from "@/CustomComponent/Popup";

const FeaturedPage = () => {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();

  const cardsData = [
    {
      id: "card1",
      heading: "For Schools & Institutions",
      text: "Streamline education and improve outcomes with a complete online learning solution. Our platform helps schools move seamlessly to the cloud, making education more accessible, efficient, and scalable—without heavy infrastructure or setup.",
      bulletPoints: [
        "Specialty LMS catered to each school",
        "Efficient, User Friendly, and Cost Effective",
        "Dedicated Support Team",
        "Income Opportunities  for schools and teachers just through signing-up",
        "switch and save up to 30% off current LMS ",
        "Worldwide access for students and teachers",
        "100% cloud-based – no heavy setup required",
        "Manage courses, teachers, and students all in one place",
        "Centralized grading, announcements, and communication",
        "Secure and reliable platform for every institution",
        "Quick onboarding and easy adoption for schools",
        "Improve overall academic performance and engagement",
        "Automated notifications and reminders",
        "Scalable solution for institutions of any size",
      ],
    },
    {
      id: "card2",
      heading: "For Teachers",
      text: "Simplify teaching and focus on what matters most—your students. Our LMS gives teachers the tools to create engaging courses, track performance, and personalize learning experiences with ease.",
      bulletPoints: [
        "Create and manage courses effortlessly",
        "Dedicated Support Team",
        "Income Opportunities  for schools and teachers just through signing-up",
        "Assign and grade homework, projects, and exams",
        "Chat with students individually or as a group",
        "Access and manage detailed gradebooks",
        "Customize your profile and teaching style",
        "Track student performance with analytics",
        "Upload video lectures and course materials",
        "Send announcements and reminders instantly",
        "Save time with streamlined teaching workflows",
      ],
    },
    {
      id: "card3",
      heading: "For Students K-12 / College Level",
      text: "Learn anywhere, anytime—with everything you need at your fingertips. Students can enjoy a smooth learning experience, connect with teachers, and stay on top of assignments—all from one simple platform.",
      bulletPoints: [
        "Enroll in courses and complete assignments easily",
        "Dedicated Support Team",
        "Access video lectures, notes, and documents anytime",
        "Communicate directly with teachers through built-in messaging",
        "View grades and progress in real time",
        "24/7 support to help whenever you’re stuck",
        "Access a variety of learning resources in one place",
        "Learn at your own pace with flexible schedules",
        "Stay updated with notifications and announcements",
        "Connect and collaborate with peers worldwide",
      ],
    },
  ];

  return (
    <div>
      <div>
        {showPopup && <Popup onClose={() => setShowPopup(false)} />}


      </div>
      {/* Hero Section */}

      <section className="relative py-6 px-6 sm:px-10 bg-gray-100 flex justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left: Blackboard with kids video */}


          {/* Right: Acewall blurb */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-snug text-gray-900 font-['Shadows_Into_Light']">
              Best online platform for education.
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-['Patrick_Hand'] max-w-lg mx-auto lg:mx-0">
              Since 2006, <span className="font-bold text-green-700">Acewall Scholars</span> has
              helped students master math, science, English, and reading comprehension.
              We’re making learning seamless, teaching effortless, and school management smarter.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/contact")}
                className="bg-green-600 text-white font-bold py-2 px-5 rounded-md shadow-md hover:bg-green-700 transition border-2 border-green-700"
              >
                Get Started Today
              </button>

              <Link to="/home">
                <button className="border-2 border-green-700 text-green-700 font-bold py-2 px-5 rounded-md shadow-md hover:bg-green-700 hover:text-white transition">
                  Existing user? Log in
                </button>
              </Link>
            </div>
          </div>


          <div
            className="relative w-full lg:w-1/2 flex justify-center items-center bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
            style={{ backgroundImage: `url(${blackboard})` }}
          >
            <div className="relative w-[80%] aspect-video my-20">
              {/* Blackboard texture overlays */}
              <div className="absolute inset-0 bg-black/20 z-10 rounded-lg"></div>

              {/* Video inside the board */}
              <video
                src={bgvideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-90 rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="relative mt-16 mb-20 sm:mb-20">
        {/* Card Wrapper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 sm:gap-6 px-4 sm:px-0">

          {/* Card 1 */}
          <div
            id="schools"
            onClick={() =>
              document.getElementById("card1")?.scrollIntoView({ behavior: "smooth" })
            }
            className="relative bg-blue-900 text-white text-center rounded-lg p-6 pb-28 sm:pb-24 shadow-lg cursor-pointer hover:bg-blue-800 transition"
          >
            <h3 className="text-lg sm:text-2xl font-bold mb-12 sm:mb-20">
              Schools/Institutions
            </h3>
            <img
              src="https://imgs.search.brave.com/CADB44w2NE-4yBTcKGt32WI63tXzFpozkZ_HJXPYN4E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG5p/Lmljb25zY291dC5j/b20vaWxsdXN0cmF0/aW9uL3ByZW1pdW0v/dGh1bWIvc2Nob29s/LWJ1aWxkaW5nLWls/bHVzdHJhdGlvbi1k/b3dubG9hZC1pbi1z/dmctcG5nLWdpZi1m/aWxlLWZvcm1hdHMt/LXVuaXZlcnNpdHkt/cGFjay1lZHVjYXRp/b24taWxsdXN0cmF0/aW9ucy04NzQ2NjUw/LnBuZw"
              alt="Schools"
              className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-20 w-50 sm:w-38 lg:w-55 object-contain"
            />
          </div>

          {/* Card 2 */}
          <div
            id="teachers"
            onClick={() =>
              document.getElementById("card2")?.scrollIntoView({ behavior: "smooth" })
            }
            className="relative bg-blue-900 text-white text-center rounded-lg p-6 pb-28 sm:pb-24 shadow-lg cursor-pointer hover:bg-blue-800 transition"
          >
            <h3 className="text-lg sm:text-2xl font-bold mb-12 sm:mb-20">
              Teachers
            </h3>
            <img
              src={teacherpic}
              alt="Teachers"
              className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-20 w-50 sm:w-38 lg:w-55 object-contain"
            />
          </div>

          {/* Card 3 */}
          <div
            id="students"
            onClick={() =>
              document.getElementById("card3")?.scrollIntoView({ behavior: "smooth" })
            }
            className="relative bg-blue-900 text-white text-center rounded-lg p-6 pb-28 sm:pb-24 shadow-lg cursor-pointer hover:bg-blue-800 transition"
          >
            <h3 className="text-lg sm:text-2xl font-bold mb-12 sm:mb-20">
              Students K-12 / College Level
            </h3>
            <img
              src={stppic}
              alt="Students"
              className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-20 w-50 sm:w-38 lg:w-75 object-contain"
            />
          </div>
        </div>

        {/* Bottom section (placeholder or content?) */}
        <div className="bg-[#156082] py-12 sm:py-20 mt-6 px-4 sm:px-10">
          {/* Content goes here */}
        </div>
      </div>
      {/* Featured Cards Section */}
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-[3vw] font-bold mb-4">
              Who We Serve
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
              Empowering schools, teachers, and students with one powerful
              platform that makes learning seamless, teaching effortless, and
              school management smarter—anytime, anywhere.
            </p>
          </div>
        </div>

        <StackedCard cardsData={cardsData} />
      </section>
      {/* <section id="contact">
        <FeaturedContantCard />
      </section> */}

    </div>
  );
}; 3

export default FeaturedPage;