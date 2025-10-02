"use client";

import { useContext, useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [unpublishedCount, setUnpublishedCount] = useState(0);

  const { user } = useContext(GlobalContext);
  const teacherId = user._id;

  // Fetch all courses (general)
  useEffect(() => {
    const getTeacherCourse = async () => {
      try {
        const res = await axiosInstance("/course/getindividualcourse");
        setCourses(res.data.courses);
      } catch (err) {
        console.log(err);
      }
    };
    getTeacherCourse();
  }, []);

  // Fetch all students
  useEffect(() => {
    const getTeacherStudents = async () => {
      try {
        const res = await axiosInstance("/course/getallCoursesforTeacher");
        setStudents(res.data.students);
      } catch (err) {
        console.log(err);
      }
    };
    getTeacherStudents();
  }, []);

  // Fetch recent comments
  useEffect(() => {
    const getRecentComments = async () => {
      try {
        const res = await axiosInstance("comment/teacher/allComment");
        setRecentComments(res.data.recentComments);
      } catch (err) {
        console.log(err);
      }
    };
    getRecentComments();
  }, []);

  // Fetch published/unpublished course stats
  useEffect(() => {
    const fetchCourseStats = async () => {
      try {
        const [publishedRes, unpublishedRes] = await Promise.all([
          axiosInstance.get("/course/getTeacherCourses?published=true"),
          axiosInstance.get("/course/getTeacherCourses?published=false"),
        ]);
        setPublishedCount(publishedRes.data.courses.length);
        setUnpublishedCount(unpublishedRes.data.courses.length);
      } catch (err) {
        console.error("Error fetching course stats:", err);
      }
    };
    fetchCourseStats();
  }, []);

  const metrics = [
    {
      title: "Total Courses",
      link: "/teacher/courses",

      value: courses?.length || 0,
      icon: (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <BookOpen size={16} className="text-green-600" />
        </div>
      ),
    },
    {
      title: "Students",
      link: "/teacher/allstudent",

      value: students?.length || 0,
      icon: (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Users size={16} className="text-blue-600" />
        </div>
      ),
    },
    {
      title: "Published Courses",
      value: publishedCount,
      link: "/teacher/courses?published=true",
      icon: (
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <FileText size={16} className="text-emerald-600" />
        </div>
      ),
    },
    {
      title: "Unpublished Courses",
      value: unpublishedCount,
      link: "/teacher/courses?published=false",
      icon: (
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <FileText size={16} className="text-red-600" />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        <h1 className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg ">
          Dashboard
        </h1>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric, i) => {
            const cardContent = (
              <Card className="h-full transition hover:bg-gray-50 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </CardTitle>
                  {metric.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {metric.value}
                  </div>
                </CardContent>
              </Card>
            );

            return (
              <div key={i} className="h-full">
                {metric.link ? (
                  <Link to={metric.link} className="block h-full">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </div>
            );
          })}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentComments.length > 0 ? (
                recentComments.map((comment, i) => (
                  <Link
                    key={i}
                    to={`/teacher/courses/courseDetail/${comment.course}`}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <MessageSquare size={18} />
                      </div>
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="text-sm">
                            <span className="text-gray-700 font-medium">
                              {`${comment?.createdby?.firstName} ${comment?.createdby?.middleName} ${comment?.createdby?.lastName}`}
                            </span>{" "}
                            {comment.action}
                          </p>
                          <span className="text-gray-800 font-medium mt-1 block">
                            {comment.text}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No recent activity to show.
                </p>
              )}
            </div>
          </div>

          {/* Recent Courses Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Courses</h2>
            <div className="space-y-4">
              {courses
                ?.filter((course) => course.published === true)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .map((course, i) => (
                  <Link
                    key={i}
                    to={`/teacher/courses/courseDetail/${course._id}`}
                    className="block"
                  >
                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border hover:bg-gray-50 transition">
                      <img
                        src={course?.thumbnail?.url || "/placeholder.svg"}
                        alt={course?.courseTitle}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-sm mb-1">
                          {course?.courseTitle}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {course?.category?.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
