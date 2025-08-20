import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  StudentProfileCourseCard,
  StudentProfileStatCard,
} from "@/CustomComponent/Card";
import { Mail, Calendar, School } from "lucide-react";
import avatar from "@/assets/avatar.png";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";

export default function StudentProfile() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student;


  const handleConversation = async () => {
    try {
      await axiosInstance.post("conversation/create", {
        memberId: student._id,
      });
      navigate("/teacher/messages"); // ✅ fixed typo
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };



  if (!student) {
    // Fallback if user directly visits the URL without navigation state
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Student data not found.</p>
        <button
          className="mt-4 text-blue-500 underline"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-xl shadow-md">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <Avatar className="w-24 h-24 rounded-full overflow-hidden ring-3 ring-gray-500 shadow-sm">
          <AvatarImage
            src={student?.profileImg?.url || avatar}
            alt={student?.firstName}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="w-full h-full bg-gray-200 text-gray-600 text-xl font-semibold flex items-center justify-center rounded-full">
            {student?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-2 gap-y-1">
            <p className="text-2xl font-bold text-gray-800">
              {student?.firstName}
            </p>
            {student?.middleName && (
              <p className="text-2xl font-bold text-gray-800">
                {student.middleName}
              </p>
            )}
            <p className="text-2xl font-bold text-gray-800">
              {student?.lastName}
            </p>
          </div>

          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{student?.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                Joined: {new Date(student?.createdAt).toLocaleString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" })}
              </span>
            </div>
          </div>
           <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
            <Button className="bg-green-500" onClick={handleConversation}>
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex items-center justify-center mb-10">
        <StudentProfileStatCard
          className="max-w-xs"
          icon={<School />}
          title="Enrolled Courses"
          value={student?.courses?.length || 0}
        />
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 col-span-full mb-4">
          View Grade Book of Enrolled Courses
        </h2>

        {student?.courses?.map((course, index) => (
          <Link
            to={`/teacher/courseGrades/${id}/${course._id}`}
            key={index}
            className="group relative rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <StudentProfileCourseCard course={course} />
            </div>

            <div className="absolute inset-0 bg-green-600 bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-lg font-semibold">View Grade Book</span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
