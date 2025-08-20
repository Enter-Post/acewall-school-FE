import { useNavigate, Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { Button } from "@/components/ui/button";

import acewallscholarslogo from "../assets/acewallscholarslogo.webp";
import acewallshort from "../assets/acewallshort.png";

import Footer from "@/CustomComponent/Footer";
import ScrollToTop from "@/lib/scrolltop";
import { GlobalContext } from "@/Context/GlobalProvider";
  
const MainLayout = () => {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);

  const handleGoToAccount = () => {
    if (!user) {
      return navigate("/login");
    }

    if (user.role === "student") {
      navigate("/student/mycourses");
    } else if (user.role === "teacher") {
      navigate("/teacher/");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="flex h-screen flex-col w-screen">
        <div className="h-8 bg-green-600 flex justify-end items-end px-5 cursor-pointer" />
        <header className="sticky top-0 z-10 bg-white w-full">
          <div className="flex h-16 items-center justify-between px-4">
            <Link className="block md:hidden" to={"/"}>
              <img src={acewallshort} alt="Mobile Logo" className="w-8 rounded-full h-auto cursor-pointer" />
            </Link>
            <Link className="hidden md:block" to={"/"}>
              <img src={acewallscholarslogo} alt="Desktop Logo" className="w-40 h-auto cursor-pointer" />
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {/* Conditionally render the button based on whether user is logged in */}
              {user && (
                <Button onClick={handleGoToAccount} className="bg-green-600 text-white hover:bg-green-700">
                  Go to your account
                </Button>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 hide-scrollbar overflow-y-scroll">
            <Outlet />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
