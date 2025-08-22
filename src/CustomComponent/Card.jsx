import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import avatar from "../assets/avatar.png";

function DeshboardAnnouncementCard({ mainHeading, data, link, height }) {
  console.log(data, "data");
  return (
    <Card
      className={`bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full`}
      style={{ height: height || "100%" }}
    >
      <CardHeader className="flex-row justify-between discussions-center bg-green-600 py-3 rounded">
        <CardTitle className="text-lg text-white ">{mainHeading}</CardTitle>
        <Link to={link} className="text-white text-xs">
          View All
        </Link>
      </CardHeader>

      <CardContent className="p-0 overflow-auto max-h-[390px]">
        <div className="divide-y divide-gray-100">
          {data?.length > 0 ? (
            data?.map((item, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-start justify-between  transition"
              >
                <div className="flex-1">
                  <Link to={link}>
                    <p className="font-semibold text-md">{item.title}</p>
                    <p className="text-sm text-gray-500 mb-2 mt-1">
                      {item.course.courseTitle}
                    </p>
                  </Link>
                </div>

                <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                  {item.createdAt ? (
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  ) : item.createdAt ? (
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  ) : null}
                  {item.time && <p>{item.time}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-10">
              No data available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DeshBoardCourseCard({ mainHeading, data, link, height }) {
  return (
    <Card
      className={`bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full`}
      style={{ height: height || "100%" }}
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle className="text-lg text-white ">{mainHeading}</CardTitle>
        <Link to={link} className="text-white text-xs">
          View All
        </Link>
      </CardHeader>

      <CardContent className="p-0 overflow-auto max-h-[390px]">
        <div className="divide-y divide-gray-100">
          {data?.length > 0 ? (
            data?.map((item, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-start justify-between  transition"
              >
                <div className="flex-1">
                  <Link to={`/student/mycourses/${item?._id}`}>
                    {item?.course?.courseTitle ? (
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item?.course?.courseTitle}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800">
                          {item?.course}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item?.course?.title}
                        </p>
                      </>
                    )}
                  </Link>
                </div>

                <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                  {item?.enrolledAt ? (
                    <div>
                      <p>Enrolled at</p>
                      <p>{new Date(item?.enrolledAt).toLocaleDateString()}</p>
                    </div>
                  ) : item.course.createdAt ? (
                    <p>
                      {new Date(item?.course?.createdAt).toLocaleDateString()}
                    </p>
                  ) : null}
                  {item?.course?.time && <p>{item?.course?.time}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-10">
              No data available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Assignment({ mainHeading, data, bgcolor, bordercolor, height }) {
  return (
    <Card
      className={`bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full`}
      style={{ height: height || "100%" }} // Same height as DeshBoardCard
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle className="text-lg text-white">Assessment Due</CardTitle>
        <Link to="assignment" className="text-white text-xs">
          View All
        </Link>
      </CardHeader>
      <CardContent className={`p-0 ${bgcolor}`}>
        <Link to="assignment">
          <div className={`divide-y`}>
            {data.map((assignment, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between">
                  <h3 className="hover:font-semibold font-semibold transition-all duration-300 cursor-pointer">
                    {assignment.course}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Due: {assignment.dueDate}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm mt-2  transition-all duration-300 cursor-pointer">
                  {assignment.Assignment}
                </p>
              </div>
            ))}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

function AnnouncementCard({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card className="w-full mx-auto rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-200">
      <CardContent className="p-0 divide-y divide-gray-200">
        {data?.map((announcement, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="px-6 py-4">
              {/* Title and Date */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleOpen(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {announcement.title}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{announcement.date}</p>
                  {isOpen ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </div>
              </div>

              {/* Course */}
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-800">Course:</span>{" "}
                {announcement.course}
              </p>

              {/* Dropdown content */}
              {isOpen && (
                <div className="mt-3 space-y-2">
                  <p className="text-gray-700">{announcement.message}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Time:</span>{" "}
                    {announcement.time}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
function CoursesCard({ course, link }) {
  return (
    <Link key={course.id} to={link}>
      <Card className="w-full overflow-hidden cursor-pointer gap-0 py-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={course.image || "/placeholder.svg"}
            alt={`${course.course} image`}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="p-4">
          <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2">
            {course.category || "Developments"}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {course.course}
          </h3>
          <div className="text-xl font-bold text-green-500 mb-3">
            ${course.Prise || "24.00"}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{course.rating || "4.9"}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>{course.students || "982,941"} students</span>
            </div>
          </div>

          {/* Add to cart button */}
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            Add To Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
}

const StudentCard = ({ student }) => (
  <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white">
    <CardContent className="px-6 py-2 flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="w-24 h-24 ring-3 ring-gray-500 shadow-sm">
          <AvatarImage
            src={student.profileImg?.url || avatar}
            alt={student.name}
            className="rounded-full object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-semibold flex items-center justify-center">
            {student.firstName[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">{student.firstName}</h3>
        <p className="text-sm text-gray-500">{student.email}</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-2">
        <span className="text-gray-500">Joined</span>
        <span className="text-right text-gray-700 font-medium">
          {new Date(student.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Optional CTA */}
      <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 ">
        View Profile
      </Button>
    </CardContent>
  </Card>
);

const TransactionCard = ({ title, data }) => (
  <Card className="h-fit p-0 gap-3 rounded mt-5">
    <CardContent className="px-3 py-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead className="text-xs font-medium text-gray-500 py-3">
              Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3">
              Time
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Earnings
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Withdrawals
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction, index) => (
            <TableRow key={index} className="border-t border-gray-100">
              <TableCell className="text-sm text-gray-700 py-4">
                {transaction.date}
              </TableCell>
              <TableCell className="text-sm text-gray-700 py-4">
                {transaction.time}
              </TableCell>
              <TableCell className="text-sm text-green-600 py-4 text-center">
                {transaction.type === "Earning"
                  ? `$${transaction.amount}`
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-red-600 py-4 text-center">
                {transaction.type === "Withdrawal"
                  ? `$${transaction.amount}`
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-black py-4 text-center">
                {transaction.balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const EarningStateCard = ({ data }) => {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center  px-6 h-full">
        <div
          className={`h-12 w-12 rounded-lg flex ${data.bgColor} items-center justify-center mr-4`}
        >
          {data.icon}
        </div>
        <div className="h-full">
          <p className="text-xl font-bold"> {data.value} </p>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const LandingPageCard = ({ name, description, imageUrl, buttonUrl }) => {
  return (
    <Card className="pb-6 pt-0 overflow-hidden cursor-pointer h-full border flex flex-col gap-4">
      <AspectRatio ratio={16 / 5}>
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </AspectRatio>
      <CardHeader>
        {/* <CardTitle>{name}</CardTitle> */}
        <p className="text-md font-bold ">{name}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 gap-6">
          <p className="text-muted-foreground  text-xs ">{description}</p>
          <a
            href={buttonUrl}
            className="inline-flex items-center justify-center w-full px-3 py-2 mt-auto text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Learn more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

function StudentProfileCourseCard({ course }) {
  return (
    <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md rounded-xl border hover:border-primary transition duration-300">
      {/* Thumbnail */}
      <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={course?.thumbnail?.url}
          alt="Course Thumbnail"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Course Info */}
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900">
          {course?.courseTitle}
        </h3>
        {/* <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course?.description}</p> */}
      </div>
    </Card>
  );
}

function StudentProfileStatCard({ title, value, icon }) {
  return (
    <Card className="p-6 flex items-center w-full gap-4 shadow-sm">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-center">{value}</p>
      </div>
    </Card>
  );
}

const MyCoursesCard = ({ course }) => {
  return (
    <Card className="pb-6 pt-0 w-full overflow-hidden cursor-pointer">
      <AspectRatio ratio={16 / 9}>
        <img
          src={course?.course?.thumbnail?.url || "/placeholder.svg"}
          alt={`${course?.course?.thumbnail?.filename} image`}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardHeader>
        <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2">
          {course?.course?.category?.title}
        </div>
        <CardTitle className="flex justify-between flex-col gap-2">
          <span>{course?.course?.courseTitle}</span>
          {/* <span className="text-lg font-semibold text-green-500">
            ${course.price}
          </span> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Language: </span>{" "}
            {course?.course?.language}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const DiscussionCard = ({ discussion, link }) => {
  return (
    <Link
      key={discussion._id}
      to={link}
      // to={`/student/discussions/${discussion._id}`}
      className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 p-4 bg-white group"
    >
      <div className="overflow-hidden rounded-md mb-2">
        <img
          src={discussion.course.thumbnail.url}
          alt={discussion.topic || "Course Thumbnail"}
          className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
        />
      </div>

      {discussion.dueDate && (
        <div className="flex discussions-center gap-2 text-xs mt-1">
          <p className="text-gray-600 font-bold">Due Date:</p>
          <div className="flex discussions-center gap-2">
            <p className="text-gray-500">
              {discussion.dueDate.date
                ? new Date(discussion.dueDate.date).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-gray-500">
              {discussion.dueDate.time
                ? discussion.dueDate.time.slice(0, 5)
                : ""}
            </p>
          </div>
        </div>
      )}

      {/* Type Badge */}
      <div
        className={`border w-fit px-2 py-1 rounded-full border-gray-200 m-2 bg-indigo-600`}
      >
        <p className="text-xs text-white">{discussion?.type}</p>
      </div>

      {/* Metadata */}
      <div className="flex justify-between discussions-center mt-3">
        <h2 className="font-semibold text-lg text-gray-800 truncate">
          {discussion?.topic}
        </h2>
        <span className="text-xs text-gray-500">
          {new Date(discussion?.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-indigo-700 font-medium">
        {discussion?.course?.courseTitle}
      </p>

      <p className="text-sm text-gray-700 line-clamp-2">
        {discussion?.description}
      </p>
    </Link>
  );
};

export default Card;

export {
  DeshboardAnnouncementCard,
  DeshBoardCourseCard,
  Assignment,
  AnnouncementCard,
  CoursesCard,
  StudentCard,
  TransactionCard,
  EarningStateCard,
  LandingPageCard,
  StudentProfileCourseCard,
  StudentProfileStatCard,
  MyCoursesCard,
  DiscussionCard,
};
