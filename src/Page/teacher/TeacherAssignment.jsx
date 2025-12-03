"use client";

import { useEffect, useState } from "react";
import { BadgePlus, Library, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function TeacherAssessment() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDateGroup, setSelectedDateGroup] = useState("all");

  const [allCategories, setAllCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [groupedAssessments, setGroupedAssessments] = useState({});

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("assessment/allAssessmentByTeacher");
        const data = response.data;

        setAssessments(data);

        const categories = [...new Set(data.map(a => a.category?.name).filter(Boolean))];
        const courses = [...new Set(data.map(a => a.course?.courseTitle).filter(Boolean))];

        setAllCategories(categories);
        setAllCourses(courses);

        const grouped = data.reduce((acc, item) => {
          const dateKey = format(new Date(item.createdAt), "MMM d, yyyy");
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(item);
          return acc;
        }, {});

        setGroupedAssessments(grouped);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter((assessment) => {
    const matchCategory =
      selectedCategory === "all" || !selectedCategory
        ? true
        : assessment?.category?.name === selectedCategory;

    const matchCourse =
      selectedCourse === "all" || !selectedCourse
        ? true
        : assessment?.course?.courseTitle === selectedCourse;

    const matchDate =
      selectedDateGroup === "all"
        ? true
        : format(new Date(assessment.createdAt), "MMM d, yyyy") === selectedDateGroup;

    return matchCategory && matchCourse && matchDate;
  });

  return (
    <main className="flex w-full min-h-screen p-6" role="main">
      <div className="w-full mx-auto">
        <h1
          className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg"
          id="assessment-heading"
        >
          Assessments
        </h1>

        {/* Filters */}
        <div
          className="flex flex-col md:flex-row md:items-center gap-4 mb-6"
          role="region"
          aria-labelledby="filter-heading"
        >
          <h2 id="filter-heading" className="sr-only">
            Filter assessments
          </h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-category" className="text-sm font-medium">
              Filter by Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="filter-category" className="w-[180px]" aria-label="Category filter">
                {selectedCategory === "all" ? "All Categories" : selectedCategory || "Select Category"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-course" className="text-sm font-medium">
              Filter by Course
            </label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger id="filter-course" className="w-[180px]" aria-label="Course filter">
                {selectedCourse === "all" ? "All Courses" : selectedCourse || "Select Course"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {allCourses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-date" className="text-sm font-medium">
              Filter by Date
            </label>
            <Select value={selectedDateGroup} onValueChange={setSelectedDateGroup}>
              <SelectTrigger id="filter-date" className="w-[200px]" aria-label="Date filter">
                {selectedDateGroup === "all" ? "All Dates" : selectedDateGroup}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {Object.keys(groupedAssessments).map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assessment List */}
        {loading ? (
          <div
            className="flex justify-center items-center py-10"
            role="status"
            aria-live="polite"
          >
            <Loader className="animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading assessments…</span>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <p className="text-center text-gray-500" role="alert">
            No assessments found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
            {filteredAssessments.map((assessment) => (
              <Link
                key={assessment._id}
                to={`/teacher/assessments/allsubmissions/${assessment._id}`}
                aria-label={`View submissions for assessment titled ${assessment?.title}`}
                role="listitem"
                className="focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg outline-none"
              >
                <Card className="w-full border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md cursor-pointer">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {assessment?.title}
                    </h3>

                    <Badge variant="light" className="bg-green-100">
                      {assessment?.category?.name}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <BadgePlus className="h-5 w-5 text-green-600" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">
                        {assessment?.course?.courseTitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {assessment?.chapter && (
                        <div className="flex items-center gap-1.5">
                          <Library className="h-4 w-4 text-green-500" aria-hidden="true" />
                          <p className="text-xs text-gray-700 truncate">
                            {assessment?.chapter?.title}
                          </p>
                        </div>
                      )}
                      {assessment?.lesson && (
                        <div className="flex items-center gap-1.5">
                          <Library className="h-4 w-4 text-green-500" aria-hidden="true" />
                          <p className="text-xs text-gray-700 truncate">
                            {assessment?.lesson?.title}
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {assessment?.description}
                    </p>

                    <p className="text-xs text-gray-500">
                      Created: {format(new Date(assessment.createdAt), "MMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
