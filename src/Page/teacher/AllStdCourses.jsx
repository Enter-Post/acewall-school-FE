import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer border rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-lg transition-all"
  >
    {course.thumbnail?.url && (
      <img
        src={course.thumbnail.url}
        alt={course.courseTitle}
        className="w-24 h-24 object-cover rounded-md mb-3"
      />
    )}
    <h3 className="font-semibold text-gray-800 text-center">{course.courseTitle}</h3>
  </div>
);

const AllStdCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const navigate = useNavigate();

  // Fetch all courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/course/getallCoursesforTeacher");
      const students = res.data.students || [];

      // Extract unique courses
      const uniqueCourses = [];
      students.forEach((student) => {
        (student.courses || []).forEach((course) => {
          if (!uniqueCourses.some((c) => c._id === course._id)) {
            uniqueCourses.push(course);
          }
        });
      });

      setCourses(uniqueCourses);
    } catch (err) {
      console.error(err);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on searchText or dropdown selection
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.courseTitle.toLowerCase().includes(searchText.toLowerCase());
      const matchesDropdown =
        selectedCourse === "All" || course._id === selectedCourse;
      return matchesSearch && matchesDropdown;
    });
  }, [courses, searchText, selectedCourse]);

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;
  if (courses.length === 0)
    return <p className="text-center mt-10">No courses found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2"
        />

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2"
        >
          <option value="All">All Courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Course cards */}
      {filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No courses match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onClick={() =>
                navigate(`/teacher/course/${course._id}`, {
                  state: { courseTitle: course.courseTitle },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStdCourses;
