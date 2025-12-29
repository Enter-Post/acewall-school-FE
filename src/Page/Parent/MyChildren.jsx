import { GlobalContext } from "@/Context/GlobalProvider";
import { StudentCard } from "@/CustomComponent/teacher/StudentCard";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingLoader from "@/CustomComponent/LoadingLoader";

const MyChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      // Using the new API endpoint we created
      const res = await axiosInstance.get("/parent/my-children");
      
      if (res.data.success) {
        setChildren(res.data.children || []);
      }
    } catch (err) {
      console.error("Error fetching children:", err);
      // Only alert if it's not a 404 (which just means no children linked yet)
      if (err.response?.status !== 404) {
        alert("Failed to load children data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  if (loading) {
    return <LoadingLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-8" role="main" aria-label="Parent Dashboard - My Children">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800" tabIndex={0}>
          My Children
        </h1>
        <p className="text-gray-500 mt-2">
          Viewing students linked to: <span className="font-medium text-blue-600">{user?.email}</span>
        </p>
      </header>

      {children.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-blue-700 text-lg" role="alert">
            No students are currently linked to your email address. 
          </p>
          <p className="text-blue-600 mt-2 text-sm">
            Please ensure the school has registered your email <strong>({user?.email})</strong> in the student's "Guardian Email" field.
          </p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          role="list"
        >
          {children.map((child) => (
            <Link
              key={child._id}
              // Redirect to a parent-view version of the profile or gradebook
              to={`/parent/student-detail/${child._id}`}
              state={{ student: child }}
              className="hover:scale-[1.02] transition-transform duration-200"
              role="listitem"
              aria-label={`View progress for ${child.firstName} ${child.lastName}`}
            >
              <StudentCard student={child} />
              
              {/* Optional: Add a "View Progress" badge or button style overlay */}
              <div className="mt-2 text-center">
                <span className="text-sm text-green-600 font-semibold hover:underline">
                  View Academic Progress →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChildren;