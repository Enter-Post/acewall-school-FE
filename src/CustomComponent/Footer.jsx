import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TermsModal from "@/CustomComponent/Termsandcondition";
import PrivacyPolicy from "./PrivacePolicy";
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { user, setSelectedSubcategoryId } = useContext(GlobalContext);

  const isGuest = !user;
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [subcategories, setSubcategories] = useState([]); // will hold objects
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show "Scroll to Top" button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch top 5 subcategories for footer navigation
  useEffect(() => {
    axiosInstance
      .get("/subcategory/get")
      .then((response) => {
        const subs = response.data?.subcategories || [];
        const topFive = subs.slice(0, 5);
        setSubcategories(topFive);
      })
      .catch((err) => {
        console.error("Failed to fetch subcategories:", err);
        setSubcategories([]);
      });
  }, []);

  const handleSubscribe = async () => {
    if (!email) {
      setError("Email is required");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/newsletter/subscribe", { email });
      setSuccess("Subscribed successfully! Thank you.");
      setEmail("");
    } catch (err) {
      setError("This email is already subscribed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (sub) => {
    setSelectedSubcategoryId(sub._id);
    navigate(`/student/courses/${sub._id}`);
  };

  const usefulLinks = [
    { name: "Home", url: "/home" },
    { name: "About Us", url: "/about" },
    { name: "Additional Services", url: "/AdditionalServices" },
    { name: "Terms", url: "/terms" },
    { name: "Privacy Policy", url: "/privacyPolicy" },
  ];

  const socialLinks = [
    { Icon: FaXTwitter, url: "https://twitter.com/AcewallScholars", label: "Twitter" },
    { Icon: Facebook, url: "https://www.facebook.com/acewallscholars", label: "Facebook" },
    { Icon: Instagram, url: "https://www.instagram.com/acewallscholarsonline/", label: "Instagram" },
    { Icon: Youtube, url: "https://youtube.com/channel/UCR7GG6Dvnuf6ckhTo3wqSIQ", label: "YouTube" },
    { Icon: Mail, url: "mailto:contact@acewallscholars.org", label: "Email" },
  ];

  return (
    <>
      <footer className="bg-black text-white mt-10" role="contentinfo">
        <div className="container mx-auto px-4 py-12">
          <div className={`grid grid-cols-1 md:grid-cols-${isStudent ? 4 : 3} gap-8`}>

            {/* Column 1: Address */}
            <section aria-labelledby="footer-about-title">
              <h3 id="footer-about-title" className="font-semibold text-white mb-4">
                Acewall Scholars
              </h3>
              <address className="not-italic space-y-2 text-sm text-gray-300">
                <p>Acewall Scholars</p>
                <p>P.O. Box 445</p>
                <p>Powhatan, VA 23139</p>
                <p>
                  Email:{" "}
                  <a href="mailto:contact@acewallscholars.org" className="text-green-500 hover:underline">
                    contact@acewallscholars.org
                  </a>
                </p>
              </address>
            </section>

            {/* Column 2: Useful Links */}
            <nav aria-label="Useful Links">
              <h3 className="font-semibold text-white mb-4">Useful Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {usefulLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.url} className="flex items-center hover:text-white">
                      <span className="text-green-500 mr-2">›</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}

                {isTeacher && (
                  <li>
                    <Link to="/teacher" className="flex items-center hover:text-white">
                      <span className="text-green-500 mr-2">›</span> Teacher Dashboard
                    </Link>
                  </li>
                )}
                {isStudent && (
                  <li>
                    <Link to="/student" className="flex items-center hover:text-white">
                      <span className="text-green-500 mr-2">›</span> Student Dashboard
                    </Link>
                  </li>
                )}
                {/* <li className="flex items-center cursor-pointer">
                  <span className="text-green-500 mr-2">›</span> <TermsModal />
                </li>
                <li className="flex items-center cursor-pointer">
                  <span className="text-green-500 mr-2">›</span> <PrivacyPolicy />
                </li> */}
              </ul>
            </nav>

            {/* Column 3: Categories (Students Only) */}
            {isStudent && (
              <nav aria-label="Popular Categories">
                <h3 className="font-semibold text-white mb-4">Topics</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {subcategories.length > 0 ? (
                    subcategories.map((sub, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleSubcategoryClick(sub)}
                          className="flex items-center hover:text-white text-left w-full"
                        >
                          <span className="text-green-500 mr-2">›</span> {sub.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No Topics found.</li>
                  )}
                </ul>
              </nav>
            )}

            {/* Column 4: Newsletter */}
            <section aria-labelledby="newsletter-heading">
              <h3 id="newsletter-heading" className="font-semibold text-white mb-4">
                Join Our Newsletter
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Stay updated with our latest news and offers.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubscribe();
                }}
                className="flex"
                aria-live="polite"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-l-md rounded-r-none border-gray-700 bg-black text-white focus:ring-0 focus:border-gray-600"
                  aria-label="Email address"
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none bg-green-500 hover:bg-green-600 text-white"
                  disabled={loading}
                  aria-disabled={loading}
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
              {error && <p role="alert" className="text-sm text-red-500 mt-2">{error}</p>}
              {success && <p role="alert" className="text-sm text-green-500 mt-2">{success}</p>}
            </section>

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-[#0c0c0c] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 text-center md:text-left">
                © Copyright{" "}
                <a
                  href="https://www.acewallscholars.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 font-bold hover:underline"
                >
                  Acewall Scholars
                </a>{" "}
                All Rights Reserved
              </p>
              <div className="flex space-x-2 mt-4 md:mt-0" aria-label="Social media links">
                {socialLinks.map(({ Icon, url, label }, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
