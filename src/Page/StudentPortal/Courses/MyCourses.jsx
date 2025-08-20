import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBox from "@/CustomComponent/SearchBox";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { MyCoursesCard } from "@/CustomComponent/Card";
import { Loader } from "lucide-react";

const CourseCards = () => {
  const [enrollment, setEnrollment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(GlobalContext);

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get("/enrollment/studentCourses", {
            params: { search: searchQuery },
          });
          setEnrollment(res.data.enrolledCourses || []);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setEnrollment([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    }, 500); // debounce delay

    return () => clearTimeout(timeoutId); // cleanup
  }, [searchQuery]);

  return (
    <section className="p-3 md:p-0">
      <div className="flex flex-col pb-5 gap-5 mb-10">
        <div>
          <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
            My Courses
          </p>
        </div>
        <SearchBox query={searchQuery} setQuery={setSearchQuery} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : enrollment.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          {searching ? (
            <>
              <h1 className="text-2xl font-semibold text-muted-foreground">
                No course found for "{searchQuery}"
              </h1>
              <p className="text-md mt-4 text-muted-foreground">
                Try a different keyword or explore all courses.
              </p>
              <Button
                className="mt-6 bg-green-500 text-white hover:bg-acewall-main"
                onClick={() => setSearchQuery("")}
              >
                Reset Search
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-muted-foreground">
                Kickstart your learning journey
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                When you enroll in a course, it will appear here.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollment.map((course, index) => (
            <Link key={index} to={`/student/mycourses/${course._id}`}>
              <MyCoursesCard course={course} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CourseCards;
