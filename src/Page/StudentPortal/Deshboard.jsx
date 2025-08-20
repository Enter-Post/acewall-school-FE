import {
  Assignment,
  DeshboardAnnouncementCard,
  DeshBoardCourseCard,
} from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";

const Deshboard = ({ user }) => {
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
      const res = await axiosInstance.get("enrollment/studentCourses");
      setCourses(res.data.enrolledCourses);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAnnouncements = async () => {
    await axiosInstance
      .get(`/announcements/getbystudent/${user?._id}`)
      .then((res) => {
        console.log(res.data.announcements);
        setAnnouncements(res.data.announcements || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCourses();
    fetchAnnouncements();
  }, []);

  return (
    <>
      <div>
        <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
          Dashboard
        </p>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 grid-rows-1 gap-6 ">
          <DeshboardAnnouncementCard
            mainHeading="Announcements"
            data={announcements}
            width="max-w-1/2"
            height={"h-auto"}
            link={"announcements"}
          />
          {/* <Assignment width mainHeading="Assessment Due" data={AssignmentDue} /> */}
          <DeshBoardCourseCard
            mainHeading="My courses"
            data={courses}
            link={"mycourses"}
            width="max-w-1/2"
          />
        </div>
      </div>
    </>
  );
};

export default Deshboard;
