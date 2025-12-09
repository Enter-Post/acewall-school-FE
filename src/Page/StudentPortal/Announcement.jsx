import React, { useEffect, useState, useContext } from "react";
import oopsImage from "@/assets/oopsimage.png";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "../../Context/GlobalProvider";
import { Loader } from "lucide-react";
import AnnouncementCardStd from "./AnnouncementCardStd";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { user } = useContext(GlobalContext);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/announcements/getbystudent/${user?._id}`
        );

        const data = response.data.announcements || [];
        setAnnouncements(data);
        console.log(data, "student announcements data");

        // Extract unique courses
        const uniqueCourses = [
          ...new Map(
            data
              .filter((a) => a.course?._id)
              .map((a) => [a.course._id, a.course])
          ).values(),
        ];
        setCourses(uniqueCourses);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchAnnouncements();
  }, [user?._id]);

  /** Filter announcements by selected course */
  const filteredAnnouncements = selectedCourse
    ? announcements.filter((a) => a.course?._id === selectedCourse)
    : announcements;

  /** Transform backend → frontend format */
  const transformedData = filteredAnnouncements.map((a) => {
    const created = new Date(a.createdAt);

    return {
      id: a._id,
      title: a.title,
      message: a.message,

      course: {
        id: a.course?._id,
        title: a.course?.courseTitle ?? "Unknown Course",
      },

      teacher: {
        id: a.teacher?._id,
        name: `${a.teacher?.firstName ?? ""} ${a.teacher?.lastName ?? ""}`,
        email: a.teacher?.email,
      },

      attachments: a.attachments || [],
      links: a.links || [],

      date: created.toLocaleDateString(),
      time: created.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  // Group announcements by course
  const groupedByCourse = Object.values(
    transformedData.reduce((acc, announcement) => {
      const courseId = announcement.course?.id || "no-course";
      if (!acc[courseId]) {
        acc[courseId] = {
          courseId,
          courseTitle: announcement.course?.title || "No Course",
          announcements: [],
        };
      }
      acc[courseId].announcements.push(announcement);
      return acc;
    }, {})
  );

  return (
    <section className="p-3 md:p-0">
      <div className="flex flex-col pb-2 gap-5">
        <h1 className="text-xl py-4 mb-4 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
          Announcements
        </h1>

        {/* Course Filter */}
        {courses.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 px-6">
            <label htmlFor="courseFilter" className="font-semibold">
              Filter by Course:
            </label>
            <select
              id="courseFilter"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : transformedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-semibold text-muted-foreground">
            No announcements available
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            When announcements are posted, they will appear here.
          </p>
          <img
            src={oopsImage}
            alt="No announcements"
            className="w-full max-w-md h-80 object-contain mt-6"
          />
        </div>
      ) : (
        <div className="overflow-hidden space-y-6">
          {groupedByCourse.map((courseGroup) => (
            <AnnouncementCardStd
              key={courseGroup.courseId}
              mainHeading={courseGroup.courseTitle}
              data={courseGroup.announcements}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Announcement;
