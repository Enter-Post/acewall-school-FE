import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import acewallscholarslogo from "../../assets/acewallscholarslogo.webp";
import acewallshort from "../../assets/acewallshort.png";
import avatar from "../../assets/avatar.png";

import {
  Menu,
  MessageCircleDashed,
  MessagesSquare,
  MessagesSquareIcon,
  Search,
  StickyNote,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { TopNavbarDropDown } from "../../CustomComponent/TopNavDropDown";
import { Input } from "../../components/ui/input";

import { DashboardCircleAddIcon } from "@/assets/Icons/deshboard";
import { Book02Icon } from "@/assets/Icons/mycoursesIcon";
import { AssessmentIcon } from "@/assets/Icons/AssignmentIcon";
import { Megaphone02Icon } from "@/assets/Icons/Announcement";
import { Target02Icon } from "@/assets/Icons/grades";

import Footer from "@/CustomComponent/Footer";
import MoreCoursesDropdown from "@/CustomComponent/MoreCoursesDropdown";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Sidebar tabs configuration
const sideBarTabs = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardCircleAddIcon />,
    path: "/student",
    allowedAsPreview: true,
  },
  {
    id: 2,
    name: "My Courses",
    icon: <Book02Icon />,
    path: "/student/mycourses",
    allowedAsPreview: true,
  },
  {
    id: 3,
    name: "My Assessment",
    icon: <AssessmentIcon />,
    path: "/student/assessment",
    allowedAsPreview: true,
  },
  {
    id: 4,
    name: "Gradebook",
    icon: <Target02Icon />,
    path: "/student/gradebook",
    allowedAsPreview: true,
  },
  {
    id: 5,
    name: "Announcements",
    icon: <Megaphone02Icon />,
    path: "/student/announcements",
    allowedAsPreview: true,
  },
  {
    name: "Discussion Rooms",
    icon: <MessagesSquareIcon />,
    path: "/student/discussions",
    allowedAsPreview: true,
  },
  {
    id: 6,
    name: "Messages",
    icon: <MessageCircleDashed />,
    path: "/student/messages",
    allowedAsPreview: false,
  },
  {
    id: 7,
    name: "Pages",
    icon: <StickyNote />,
    path: "/student/stdPages",
    allowedAsPreview: true,
  },
];

export default function Layout() {
  const { user, checkAuth, UpdatedUser, setUpdatedUser } =
    React.useContext(GlobalContext);
  const location = useLocation().pathname;

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownCourses, setDropdownCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    setOpenDropdown(false);

    try {
      const res = await axiosInstance.get("/enrollment/studentCourses", {
        params: { search: searchQuery },
      });

      // Use enrolledCourses array from response
      setDropdownCourses(res.data.enrolledCourses || []);
    } catch (error) {
      console.error("Search error:", error);
      setDropdownCourses([]);
    } finally {
      setLoading(false);
      setOpenDropdown(true);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5">
          {user && user.role === "teacherAsStudent" ? (
            <div className="flex items-center justify-between space-x-4 w-full">
              <div>
                <p className="text-white text-sm">
                  {`Viewing as Student - ${user.firstName} ${user.lastName}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="xs"
                className="px-3 text-xs"
                onClick={async () => {
                  await axiosInstance.post("auth/previewSignOut").then(() => {
                    checkAuth();
                    navigate("/teacher");
                  });
                }}
              >
                Switch to Teacher
              </Button>
            </div>
          ) : (
            <TopNavbarDropDown />
          )}
        </div>
        {/* <div>
          <div className="h-6 bg-yellow-200 flex justify-end items-end px-5">
          </div>
        </div> */}

        <div className="flex h-16 items-center justify-between px-4 border">
          {/* Sidebar toggle (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Logos */}
          <Link className="block md:hidden" to="/student">
            <img
              src={acewallshort}
              alt="Mobile Logo"
              className="w-8 h-auto rounded-full"
            />
          </Link>
          <Link className="hidden md:block" to="/student">
            <img
              src={acewallscholarslogo}
              alt="Desktop Logo"
              className="w-40 h-auto"
            />
          </Link>

          {/* Navigation links */}
          <div className="flex gap-6 items-center">
            <MoreCoursesDropdown />
            <Link
              to="/student/support"
              className="text-sm font-medium text-gray-700"
            >
              SUPPORT
            </Link>
            <Link
              to="/student/ContactUs"
              className="text-sm font-medium text-gray-700"
            >
              CONTACT US
            </Link>
          </div>

          {/* Search bar (desktop only) */}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search courses and lessons"
                    className="w-full "
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white border mt-2 max-h-60 overflow-y-auto z-50 w-64">
                {loading ? (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-700">Searching...</span>
                  </DropdownMenuItem>
                ) : dropdownCourses.length > 0 ? (
                  dropdownCourses.map((enrollment) => (
                    <DropdownMenuItem
                      key={enrollment._id}
                      asChild
                      onSelect={(e) => {
                        e.preventDefault(); // prevent dropdown closing from being interrupted
                      }}
                    >
                      <Link
                        to={`/student/mycourses/${enrollment._id}`}
                        className="w-full text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 block"
                        onClick={() => setOpenDropdown(false)}
                      >
                        {enrollment.course.courseTitle || "Untitled Course"}
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

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white ${
            isSidebarOpen ? "block" : "hidden"
          } w-screen md:w-64 flex-shrink-0 overflow-y-auto md:block`}
        >
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-4">
              <Link to="/student/account" className="block">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={UpdatedUser?.profileImg?.url || avatar}
                    alt={UpdatedUser?.firstName || "User Avatar"}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="font-medium">{UpdatedUser?.firstName  || "User"}</p>
                <p
                  className="text-sm text-gray-600 w-full max-w-[150px]  break-words"
                  title={UpdatedUser?.email || "N/A"}
                >
                  {UpdatedUser?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Mobile search */}
            <div className="flex md:hidden items-center space-x-4 mb-5">
              <Input type="text" placeholder="Search" className="flex-grow" />
              <div className="bg-green-200 hover:bg-green-300 rounded-full p-2 cursor-pointer">
                <Search className="rounded-full" />
              </div>
            </div>

            {/* Sidebar navigation */}
            <nav className="space-y-2">
              {sideBarTabs.map((tab) => {
                return user.role === "teacherAsStudent" ? (
                  <div
                    key={tab.id}
                    className={`${
                      tab.allowedAsPreview === false
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <Link
                      to={tab.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 ${
                        location === tab.path ? "bg-green-500" : "text-black"
                      }`}
                    >
                      <p>{tab.icon}</p>
                      <span
                        className={`${
                          location === tab.path
                            ? "text-white"
                            : "text-green-600"
                        }`}
                      >
                        {tab.name}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div key={tab.id}>
                    <Link
                      to={tab.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 ${
                        location === tab.path ? "bg-green-500" : "text-black"
                      }`}
                    >
                      <p>{tab.icon}</p>
                      <span
                        className={`${
                          location === tab.path
                            ? "text-white"
                            : "text-green-600"
                        }`}
                      >
                        {tab.name}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Promo image */}
            <div className="flex flex-col items-center justify-between mt-10 w-full">
              <img src={acewallshort} alt="Acewall" className="w-1/2" />
              <Link
                to="https://www.acewallscholars.org/contact-Us"
                className="text-center font-semibold text-sm mt-4 text-acewall-main"
              >
                Need Tutoring? Contact us
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Outlet */}
        <main className="flex-1 p-2 md:p-4">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
