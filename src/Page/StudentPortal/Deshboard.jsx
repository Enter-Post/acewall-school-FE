import {
  Assignment,
  DeshboardAnnouncementCard,
  DeshBoardCourseCard,
} from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";

const Dashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const AssignmentDue = [
    {
      course: "Web Development",
      Assignment: "Create Website Layout",
      dueDate: "17-Feb-2025",
    },
    {
      course: "Graphic Designing",
      Assignment: "Create a logo for a brand",
      dueDate: "11-Feb-2025",
    },
  ];

  const getCourses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("enrollment/studentCourses");
      setCourses(res.data.enrolledCourses);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axiosInstance.get(`/announcements/getbystudent/${user?._id}`);
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCourses();
    fetchAnnouncements();
  }, []);

  return (
    <main aria-labelledby="dashboard-title" className="p-4">
      <header>
        <h1
          id="dashboard-title"
          className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg"
        >
          Dashboard
        </h1>
      </header>

      <section
        aria-label="Dashboard content sections"
        className="grid sm:grid-cols-1 lg:grid-cols-2 grid-rows-1 gap-6"
      >
        {/* Announcement Card */}
        <div
          role="region"
          aria-labelledby="announcements-heading"
        >
          <h2 id="announcements-heading" className="sr-only">
            Announcements
          </h2>

          <DeshboardAnnouncementCard
            mainHeading="Announcements"
            data={announcements}
            width="max-w-1/2"
            height={"h-auto"}
            link={"announcements"}
          />
        </div>

        {/* Courses Card */}
        <div
          role="region"
          aria-labelledby="courses-heading"
          aria-busy={loading}
          aria-live="polite"
        >
          <h2 id="courses-heading" className="sr-only">
            My Courses
          </h2>

          <DeshBoardCourseCard
            mainHeading="My courses"
            data={courses}
            link={"mycourses"}
            width="max-w-1/2"
          />

          {loading && (
            <p className="text-sm text-gray-600 mt-2" role="status">
              Loading courses…
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;