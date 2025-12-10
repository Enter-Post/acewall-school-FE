import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import acewallscholarslogo from "../../assets/acewallscholarslogo.webp";
import acewallshort from "../../assets/acewallshort.png";
import avatar from "../../assets/avatar.png";

import {
  Bot,
  Coffee,
  GitGraph,
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
    icon: <DashboardCircleAddIcon aria-hidden="true" />,
    path: "/student",
    allowedAsPreview: true,
  },
  {
    id: 2,
    name: "My Courses",
    icon: <Book02Icon aria-hidden="true" />,
    path: "/student/mycourses",
    allowedAsPreview: true,
  },
  {
    id: 3,
    name: "My Assessment",
    icon: <AssessmentIcon aria-hidden="true" />,
    path: "/student/assessment",
    allowedAsPreview: true,
  },
  {
    id: 4,
    name: "Gradebook",
    icon: <Target02Icon aria-hidden="true" />,
    path: "/student/gradebook",
    allowedAsPreview: true,
  },
  {
    id: 5,
    name: "Announcements",
    icon: <Megaphone02Icon aria-hidden="true" />,
    path: "/student/announcements",
    allowedAsPreview: true,
  },
  {
    name: "Discussion Rooms",
    icon: <MessagesSquareIcon aria-hidden="true" />,
    path: "/student/discussions",
    allowedAsPreview: true,
  },
  {
    id: 6,
    name: "Pages",
    icon: <StickyNote aria-hidden="true" />,
    path: "/student/stdPages",
    allowedAsPreview: true,
  },
  {
    id: 7,
    name: "Spill the Tea",
    icon: <Coffee aria-hidden="true" />,
    path: "/Student/social",
  },
  {
    id: 8,
    name: "Grading Graphs",
    icon: <GitGraph aria-hidden="true" />,
    path: "/Student/graphs",
  },
  {
    id: 9,
    name: "Messages",
    icon: <MessageCircleDashed aria-hidden="true" />,
    path: "/student/messages",
    allowedAsPreview: false,
  },
  {
    id: 10,
    name: "AI Assistant",
    icon: <Bot />,
    path: "/student/ai",
    allowedAsPreview: false,
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

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col">
      {/* Skip link - visible when focused (you'll need small CSS to make visible on focus) */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only"
        // recommended CSS (add to your global stylesheet):
        // .skip-link { position: absolute; left: -9999px; }
        // .skip-link:focus { position: static; left: 0; top: 0; z-index: 9999; }
      >
        Skip to main content
      </a>

      {/* Top header */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5">
          {user && user.role === "teacherAsStudent" ? (
            <div className="flex items-center justify-between space-x-4 w-full">
              <div>
                <p className="text-white text-sm">
                  {`Viewing as Student - ${user.firstName || ""} ${
                    user.lastName || ""
                  }`}
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
                aria-label="Switch to teacher view"
              >
                Switch to Teacher
              </Button>
            </div>
          ) : (
            <TopNavbarDropDown />
          )}
        </div>

        <div className="flex h-16 items-center justify-between px-4 border">
          {/* Sidebar toggle (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-expanded={isSidebarOpen}
            aria-controls="primary-sidebar"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Logos */}
          <Link
            className="block md:hidden"
            to="/student"
            aria-label="Home - Acewall Scholars"
          >
            <img
              src={acewallshort}
              alt="Acewall Scholars logo — mobile"
              aria-hidden="false"
              className="w-8 h-auto rounded-full"
            />
          </Link>
          <Link
            className="hidden md:block"
            to="/student"
            aria-label="Home - Acewall Scholars"
          >
            <img
              src={acewallscholarslogo}
              alt="Acewall Scholars — Learn and grow with Acewall Scholars"
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
          <div
            className="relative w-64 hidden md:flex flex-col"
            aria-live="polite"
          >
            <DropdownMenu
              open={openDropdown}
              onOpenChange={setOpenDropdown}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <div
                  className="relative flex gap-2 w-full"
                  role="search"
                  aria-label="Course search"
                >
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search courses and lessons"
                    aria-label="Search courses and lessons"
                    className="w-full "
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white border mt-2 max-h-60 overflow-y-auto z-50 w-64">
                {loading ? (
                  <DropdownMenuItem disabled>
                    <span
                      className="text-sm text-gray-700"
                      role="status"
                      aria-live="polite"
                    >
                      Searching...
                    </span>
                  </DropdownMenuItem>
                ) : dropdownCourses.length > 0 ? (
                  dropdownCourses.map((enrollment) => (
                    <DropdownMenuItem
                      key={enrollment._id}
                      asChild
                      onSelect={(e) => {
                        // Prevent automatic close if a user needs to keyboard-navigate
                        e.preventDefault();
                      }}
                    >
                      <Link
                        to={`/student/mycourses/${enrollment._id}`}
                        className="w-full text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 block"
                        onClick={() => setOpenDropdown(false)}
                      >
                        {enrollment.course?.courseTitle || "Untitled Course"}
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
          id="primary-sidebar"
          className={`bg-white ${
            isSidebarOpen ? "block" : "hidden"
          } w-screen md:w-64 flex-shrink-0 overflow-y-auto md:block`}
          aria-labelledby="sidebar-heading"
        >
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-4">
              <Link
                to="/student/account"
                className="block"
                aria-label="Open account settings"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={UpdatedUser?.profileImg?.url || avatar}
                    alt={`Profile picture of ${
                      UpdatedUser?.firstName || "User"
                    }`}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="font-medium">
                  {UpdatedUser?.firstName || "User"}
                </p>
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
              <Input
                type="text"
                placeholder="Search"
                aria-label="Search courses"
                className="flex-grow"
              />
              <button
                type="button"
                className="bg-green-200 hover:bg-green-300 rounded-full p-2"
                aria-label="Search"
              >
                <Search className="rounded-full" aria-hidden="true" />
              </button>
            </div>

            {/* Sidebar navigation */}
            <nav className="space-y-2" role="navigation" aria-label="Primary">
              {sideBarTabs.map((tab) => {
                const isCurrent = location === tab.path;
                const unavailable =
                  tab.allowedAsPreview === false &&
                  user?.role === "teacherAsStudent";

                // If preview-disabled and user is teacherAsStudent, mark as aria-disabled and don't allow tab focus
                const commonLinkProps = {
                  to: tab.path,
                  onClick: () => setIsSidebarOpen(false),
                  className: `flex items-center space-x-3 rounded-lg px-3 py-2 ${
                    isCurrent ? "bg-green-500" : "text-black"
                  }`,
                };

                return (
                  <div key={tab.id ?? tab.name}>
                    {unavailable ? (
                      <div
                        // non-interactive wrapper for preview-disabled tabs
                        className="flex items-center space-x-3 rounded-lg px-3 py-2 opacity-50 pointer-events-none"
                        aria-disabled="true"
                        role="group"
                        title="Not available in preview mode"
                      >
                        <span aria-hidden="true">{tab.icon}</span>
                        <span className="text-green-600">{tab.name}</span>
                      </div>
                    ) : (
                      <Link
                        {...commonLinkProps}
                        // communicate current page to assistive tech
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <span aria-hidden="true">{tab.icon}</span>
                        <span
                          className={
                            isCurrent ? "text-white" : "text-green-600"
                          }
                        >
                          {tab.name}
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Promo image */}
            <div className="flex flex-col items-center justify-between mt-10 w-full">
              <img
                src={acewallshort}
                alt="Acewall shortmark"
                className="w-1/2"
              />
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
        <main id="main-content" className="flex-1 p-2 md:p-4" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
