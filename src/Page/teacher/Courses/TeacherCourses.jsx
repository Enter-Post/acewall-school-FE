import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import SearchBox from "@/CustomComponent/SearchBox";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TeacherCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);
  const [ispublished, setIspublished] = useState(true);

  console.log(ispublished, "setIspublished");

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(
            `/course/getTeacherCourses?published=${ispublished}`,
            {
              params: { search: searchQuery },
            }
          );
          setAllCourses(res.data.courses); // Corrected 'response' to 'res'
        } catch (error) {
          console.error("Error fetching courses:", error);
          setAllCourses([]); 
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    }, 500); // debounce delay

    return () => clearTimeout(timeoutId); // cleanup
  }, [searchQuery, ispublished]);

  return (
    <section className="p-3 md:p-0">
      <div className="flex flex-col pb-5 gap-5">
        <div>
          <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
            My Courses
          </p>
        </div>
        <SearchBox query={searchQuery} setQuery={setSearchQuery} />
      </div>

      <div className="mb-4">
        <Tabs defaultValue="published" className="w-full">
          <TabsList>
            <TabsTrigger value="published" onClick={() => setIspublished(true)}>UnArchived</TabsTrigger>
            <TabsTrigger value="unpublished" onClick={() => setIspublished(false)}>Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <section className="flex justify-center items-center h-full w-full">
            <Loader className="animate-spin" />
          </section>
        </div>
      ) : allCourses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          {searching ? (
            <>
              <h1 className="text-2xl font-semibold text-muted-foreground">
                No course found for "{searchQuery}"
              </h1>
              <p className="text-md mt-4 text-muted-foreground">
                Try a different keyword or explore all your courses.
              </p>
              <ul className="list-disc pl-6 leading-relaxed mt-4 text-left text-muted-foreground">
                <li>Check spelling</li>
                <li>Try different or more general terms</li>
              </ul>
              <Button
                className="mt-6 bg-green-500 text-white hover:bg-acewall-main"
                onClick={() => setSearchQuery("")}
              >
                Reset Search
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl lg:text-4xl font-semibold text-center text-muted-foreground">
                LET'S EDUCATE THE FUTURE
              </h1>
              <Link to="/teacher/courses/createCourses">
                <Button className="mt-8 py-2 px-4 rounded-md text-lg bg-green-500 text-white hover:bg-acewall-main/90 flex items-center gap-2">
                  Create Courses
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 font-bold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </Link>
              <img
                src="https://img.freepik.com/free-vector/college-campus-concept-illustration_114360-10535.jpg"
                alt="No courses"
                className="w-full h-80 object-contain mt-6"
              />
              <p className="text-lg mt-4 text-muted-foreground">
                When you create a course, it will appear here.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses?.map((course) => (
            <Link
              key={course._id}
              to={`/teacher/courses/courseDetail/${course._id}`}
            >
              <Card className="pb-6 pt-0 w-full overflow-hidden cursor-pointer">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={course.thumbnail.url || "/placeholder.svg"}
                    alt={`${course.thumbnail.file} image`}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <CardHeader>
                  <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2">
                    {course.category?.title || "Developments"}
                  </div>
                  <CardTitle>{course.courseTitle}</CardTitle>
                  <p className="text-xs">
                    Teacher: {course.createdby?.firstName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Language: {course.language}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default TeacherCourses;
