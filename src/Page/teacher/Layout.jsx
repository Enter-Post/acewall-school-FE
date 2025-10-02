import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import acewallscholarslogo from "../../assets/acewallscholarslogo.webp";
import acewallshort from "../../assets/acewallshort.png";
import {
  Menu,
  MessageCircleDashed,
  Search,
  BadgePlus,
  DollarSign,
  GraduationCap,
  Wallet,
  MessagesSquare,
  NotepadText,
  MessagesSquareIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../../components/ui/button";
import { TeacherTopNavbarDropDown } from "@/CustomComponent/TeacherTopNavDropDown";
import { Input } from "../../components/ui/input";
import { DashboardCircleAddIcon } from "@/assets/Icons/deshboard";
import { Book02Icon } from "@/assets/Icons/mycoursesIcon";
import { AssessmentIcon } from "@/assets/Icons/AssignmentIcon";
import { Megaphone02Icon } from "@/assets/Icons/Announcement";
import Footer from "@/CustomComponent/Footer";
import { useContext } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { useState } from "react";
import avatar from "../../assets/avatar.png";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/lib/AxiosInstance";
import { FaHandFist } from "react-icons/fa6";

const sideBarTabs = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardCircleAddIcon />,
    path: "/teacher",
  },
  { id: 2, name: "My Courses", icon: <Book02Icon />, path: "/teacher/courses" },
  {
    id: 6,
    name: "Create Course",
    icon: <BadgePlus />,
    path: "/teacher/courses/createCourses",
  },
  {
    id: 3,
    name: "Assessments",
    icon: <AssessmentIcon />,
    path: "/teacher/assessments",
  },
  {
    id: 5,
    name: "Announcements",
    icon: <Megaphone02Icon />,
    path: "/teacher/announcements",
  },
  {
    id: 12,
    name: "Messages",
    icon: <MessageCircleDashed />,
    path: "/teacher/messages",
  },
    {
      name: "Discussion Rooms",
      icon: <MessagesSquareIcon />,
      path: "/teacher/discussions?type=all",
    },
  {
    id: 13,
    name: "Students",
    icon: <GraduationCap />,
    path: "/teacher/allStudent",
  },
  {
    id: 14,
    name: "Support",
    icon: <FaHandFist />,
    path: "/teacher/support",
  },
];

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { checkAuth, user, Authloading, setAuthLoading, UpdatedUser } =
    useContext(GlobalContext);
  const location = useLocation().pathname;

  const isVerified = user?.isVarified === true;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownCourses, setDropdownCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    setOpenDropdown(false);

    try {
      const res = await axiosInstance.get("/course/getindividualcourse", {
        params: { search: searchQuery },
      });

      const courses = res.data.courses || [];
      setDropdownCourses(courses);
    } catch (error) {
      console.error("Search error:", error);
      setDropdownCourses([]);
    } finally {
      setLoading(false);
      setOpenDropdown(true);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part.toLowerCase() === query.toLowerCase() ? (
              <span className="text-green-600 font-semibold">{part}</span>
            ) : (
              part
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5 cursor-pointer">
          <TeacherTopNavbarDropDown />
        </div>
        <div className="flex h-16 items-center justify-between px-4 border">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Link to="/teacher" className="block md:hidden">
            <img
              src={acewallshort}
              alt="Mobile Logo"
              className="w-8 rounded-full h-auto cursor-pointer"
            />
          </Link>
          <Link to="/teacher" className="hidden md:block">
            <img
              src={acewallscholarslogo}
              alt="Desktop Logo"
              className="w-40 h-auto cursor-pointer"
            />
          </Link>

          <div className="relative w-64 hidden md:flex flex-col">
            <DropdownMenu
              open={openDropdown}
              onOpenChange={setOpenDropdown}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <div className="relative flex gap-2 w-full">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!e.target.value.trim()) {
                        setDropdownCourses([]);
                        setOpenDropdown(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="Search courses and lessons"
                    className="w-full border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent rounded-md transition-all"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-md rounded-md mt-2 max-h-60 overflow-y-auto z-50 w-64">
                {loading ? (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-700">Searching...</span>
                  </DropdownMenuItem>
                ) : dropdownCourses.length > 0 ? (
                  dropdownCourses.map((course) => (
                    <DropdownMenuItem asChild key={course._id}>
                      <Link
                        to={`/teacher/courses/courseDetail/${course._id}`}
                        onClick={() => setOpenDropdown(false)}
                        className="w-full block text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        {highlightMatch(
                          course.courseTitle || "Untitled Course",
                          searchQuery
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-500">
                      No results found
                    </span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`relative bg-white ${
            isSidebarOpen ? "block" : "hidden"
          } w-screen md:w-64 flex-shrink-0 overflow-y-auto md:block`}
        >
          <div className="p-4">
            <div className="flex items-center space-x-3 pb-4">
              <Link to="/teacher/account" className="w-10 h-10 block">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={UpdatedUser?.profileImg?.url || avatar}
                    alt={UpdatedUser?.firstName || "User Avatar"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="font-medium">{UpdatedUser?.firstName || "User"}</p>
                <p
                  className="text-sm text-gray-600 w-full max-w-[150px] break-words"
                  title={UpdatedUser?.email || "N/A"}
                >
                  {UpdatedUser?.email || "N/A"}
                </p>
              </div>
            </div>
            <nav className="space-y-2">
              {sideBarTabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 ${
                    location === tab.path ? "bg-green-500" : "text-black"
                  }`}
                >
                  <p>{tab.icon}</p>
                  <span
                    className={`${
                      location === tab.path ? "text-white" : "text-green-600"
                    }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="rounded-full flex flex-col items-center justify-between mt-10 w-full">
              <img src={acewallshort} alt="" className="w-1/2" />
              <Link
                to="https://www.acewallscholars.org/contact-Us"
                className="text-center font-semibold text-sm mt-4 text-acewall-main"
              >
                Need Tutoring? Contact us
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-2 md:p-4 hide-scrollbar overflow-y-scroll w-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
