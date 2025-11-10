import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatar from "../assets/avatar.png";
import { toast } from "sonner";

export default function SearchCourseDialog() {
  const [open, setOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!courseCode.trim()) {
      setError("Please enter a course code.");
      return;
    }

    setLoading(true);
    setError("");
    setCourse(null);

    try {
      // ✅ Call your updated API route
      const res = await axiosInstance.get(
        `/course/searchCoursebycode/${courseCode}`
      );

      console.log(res, "course search by code response");
      setCourse(res.data.course);
    } catch (err) {
      console.log(err, "course search by code response");
      setError(err.response?.data?.message || "Course not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async (courseID) => {
    await axiosInstance
      .post(`enrollment/create/${courseID}`)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        navigate("/student/mycourses");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error || "Something went wrong");
      });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Search Course by Code</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Course</DialogTitle>
          <DialogDescription>
            Enter a course code to find its details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Enter course code (e.g. ENG101)"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {course && (
          //   <Link to={`/student/course/detail/${course._id}`}>
          <div
            className="mt-4 border rounded-lg p-3 bg-gray-50"
            onClick={() => {
              handleEnrollment(course._id);
            }}
          >
            <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
            <p className="text-sm text-gray-600">Code: {course.courseCode}</p>
            <p className="text-sm text-gray-600">Language: {course.language}</p>
            {course.category && (
              <p className="text-sm text-gray-600">
                Category: {course.category.title}
              </p>
            )}
            {course.subcategory && (
              <p className="text-sm text-gray-600">
                Subcategory: {course.subcategory.title}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <Avatar>
                <AvatarImage
                  src={course.createdby.profileImg?.url || avatar}
                  alt=""
                />
                <AvatarFallback>
                  <p className="text-sm text-gray-600">
                    {`${course.createdby.firstName} ${course.createdby.lastName}`}
                  </p>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-600">
                {`${course.createdby.firstName} ${course.createdby.lastName}`}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {course.courseDescription}
            </p>
          </div>
          //   </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}
