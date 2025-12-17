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
  Coffee,
  GitGraph,
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
import FloatingMessagesDialog from "../StudentPortal/Messages";

const sideBarTabs = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardCircleAddIcon aria-hidden="true" />,
    path: "/teacher",
  },
  {
    id: 2,
    name: "My Courses",
    icon: <Book02Icon aria-hidden="true" />,
    path: "/teacher/courses",
  },
  {
    id: 6,
    name: "Create Course",
    icon: <BadgePlus aria-hidden="true" />,
    path: "/teacher/courses/createCourses",
  },
  {
    id: 3,
    name: "Assessments",
    icon: <AssessmentIcon aria-hidden="true" />,
    path: "/teacher/assessments",
  },
  {
    id: 5,
    name: "Announcements",
    icon: <Megaphone02Icon aria-hidden="true" />,
    path: "/teacher/announcements",
  },
  {
    id: 12,
    name: "Messages",
    icon: <MessageCircleDashed aria-hidden="true" />,
    path: "/teacher/conversation/courses",
  },
  {
    name: "Discussion Rooms",
    icon: <MessagesSquareIcon aria-hidden="true" />,
    path: "/teacher/discussions/allCourses",
  },
  {
    id: 13,
    name: "Students",
    icon: <GraduationCap aria-hidden="true" />,
    path: "/teacher/coursesstd",
  },
  {
    id: 14,
    name: "Spill the Tea",
    icon: <Coffee aria-hidden="true" />,
    path: "/teacher/social",
  },
  {
    id: 15,
    name: "Grading Graphs",
    icon: <GitGraph aria-hidden="true" />,
    path: "/teacher/graphs",
  },
  {
    id: 16,
    name: "Support",
    icon: <FaHandFist aria-hidden="true" />,
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
      {/* Skip link for keyboard users */}
      <a
        href="#maincontent"
        className="sr-only focus:not-sr-only focus:skip-link inline-block px-4 py-2"
        aria-label="Skip to main content"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-10 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5 cursor-pointer">
          <TeacherTopNavbarDropDown />
        </div>
        <div
          className="flex h-16 items-center justify-between px-4 border"
          role="banner"
        >
          {/* Sidebar toggle (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-controls="teacher-sidebar"
            aria-expanded={isSidebarOpen}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Mobile logo */}
          <Link
            to="/teacher"
            className="block md:hidden"
            aria-label="Go to Teacher Dashboard"
          >
            <img
              src={acewallshort}
              alt="Acewall Scholars short logo"
              className="w-8 rounded-full h-auto cursor-pointer"
            />
          </Link>

          {/* Desktop logo */}
          <Link
            to="/teacher"
            className="hidden md:block"
            aria-label="Go to Teacher Dashboard"
          >
            <img
              src={acewallscholarslogo}
              alt="Acewall Scholars full logo"
              className="w-40 h-auto cursor-pointer"
            />
          </Link>

          {/* Search */}
          <div
            className="relative w-64 hidden md:flex flex-col"
            aria-hidden={false}
          >
            <DropdownMenu
              open={openDropdown}
              onOpenChange={setOpenDropdown}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <div className="relative flex gap-2 w-full">
                  <Input
                    type="text"
                    id="teacher-search"
                    aria-label="Search courses and lessons"
                    aria-describedby="search-help"
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
                    className="w-full border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="bg-white border border-gray-200 shadow-md rounded-md mt-2 max-h-60 overflow-y-auto z-50 w-64"
                role="listbox"
                aria-label="Search results"
                id="search-results"
              >
                {loading ? (
                  <DropdownMenuItem disabled role="option" aria-disabled="true">
                    <span className="text-sm text-gray-700">Searching...</span>
                  </DropdownMenuItem>
                ) : dropdownCourses.length > 0 ? (
                  dropdownCourses.map((course) => (
                    <DropdownMenuItem
                      asChild
                      key={course._id}
                      role="option"
                      aria-selected="false"
                    >
                      <Link
                        to={`/teacher/courses/courseDetail/${course._id}`}
                        onClick={() => setOpenDropdown(false)}
                        className="w-full block text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                      >
                        {highlightMatch(
                          course.courseTitle || "Untitled Course",
                          searchQuery
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled role="option" aria-disabled="true">
                    <span className="text-sm text-gray-500">
                      No results found
                    </span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <p id="search-help" className="sr-only">
              Type a course title and press Enter or click the search button.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          id="teacher-sidebar"
          className={`relative bg-white ${
            isSidebarOpen ? "block" : "hidden"
          } w-screen md:w-64 flex-shrink-0 overflow-y-auto md:block`}
          aria-label="Teacher navigation"
        >
          <div className="p-4">
            <div className="flex items-center space-x-3 pb-4">
              <Link
                to="/teacher/account"
                className="w-10 h-10 block"
                aria-label="Open account settings"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={UpdatedUser?.profileImg?.url || avatar}
                    alt={
                      UpdatedUser?.firstName
                        ? `${UpdatedUser.firstName} avatar`
                        : "User Avatar"
                    }
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="font-medium">
                  {UpdatedUser?.firstName || "User"}
                </p>
                <p
                  className="text-sm text-gray-600 w-full max-w-[150px] break-words"
                  title={UpdatedUser?.email || "N/A"}
                >
                  {UpdatedUser?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Navigation list */}
            <nav className="space-y-2" aria-label="Main teacher navigation">
              <ul className="space-y-2">
                {sideBarTabs.map((tab) => {
                  const isActive = location === tab.path;
                  return (
                    <li key={tab.name}>
                      <Link
                        to={tab.path}
                        onClick={() => {
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors ${
                          isActive
                            ? "bg-green-500 text-white"
                            : "text-black hover:bg-gray-50"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span aria-hidden="true">{tab.icon}</span>
                        <span
                          className={`${
                            isActive ? "text-white" : "text-green-600"
                          }`}
                        >
                          {tab.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="rounded-full flex flex-col items-center justify-between mt-10 w-full">
              <img
                src={acewallshort}
                alt="Acewall Scholars short logo"
                className="w-1/2"
              />
              <Link
                to="https://www.acewallscholars.org/contact-Us"
                className="text-center font-semibold text-sm mt-4 text-acewall-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Contact us for tutoring"
              >
                Need Tutoring? Contact us
              </Link>
            </div>
          </div>
        </aside>

        <FloatingMessagesDialog />

        <main
          id="maincontent"
          className="flex-1 p-2 md:p-4 hide-scrollbar overflow-y-scroll w-full"
          role="main"
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
