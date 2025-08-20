import { GlobalContext } from "@/Context/GlobalProvider";
import { StudentCard } from "@/CustomComponent/Card";
import SelectCmp from "@/CustomComponent/SelectCmp";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useContext(GlobalContext);

  // Fetch students based on current filters
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8,
      };
      if (selectedCourse && selectedCourse !== "All") {
        params.courseTitle = selectedCourse;
      }

      const res = await axiosInstance.get("/course/getallCoursesforTeacher", {
        params,
      });

      setStudents(res.data.students || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      alert("Failed to load students. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, selectedCourse]);

  // Extract unique course titles from the fetched students
  const courseTitles = useMemo(() => {
    const allCourses = students.flatMap(student => student.courses || []);
    const uniqueTitles = [...new Set(allCourses.map(course => course.courseTitle))];
    return ["All", ...uniqueTitles]; // Add "All" at the beginning
  }, [students]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Students{" "}
        <span className="font-normal text-gray-500">
          ({students?.length.toLocaleString()})
        </span>
      </h1>

      <div className="mb-6 max-w-xs">
        <SelectCmp
          data={courseTitles}
          title="Filter by course title"
          className="w-full"
          value={selectedCourse}
          onChange={(val) => {
            setSelectedCourse(val);
            setPage(1); // Reset page when filter changes
          }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <p>No students found. Please try selecting a different course.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student, index) => (
              <Link key={index} to={`/teacher/studentProfile/${student._id}`} state={{ student }}>
                <StudentCard student={student} />
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">{`Page ${page} of ${totalPages}`}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllStudent;
