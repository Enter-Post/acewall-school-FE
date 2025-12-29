import { GlobalContext } from "@/Context/GlobalProvider";
import { StudentCard } from "@/CustomComponent/teacher/StudentCard";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Essential for navigation
import LoadingLoader from "@/CustomComponent/LoadingLoader";

const MyChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/parent/my-children");
        if (res.data.success) setChildren(res.data.children || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchChildren();
  }, [user]);

  if (loading) return <LoadingLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Children</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children.map((child) => (
          <Link
            key={child._id}
            // This dynamically creates the URL /parent/child-gradebook/658b...
            to={`/parent/child-gradebook/${child._id}`}
            className="hover:scale-[1.02] transition-transform duration-200"
          >
            <StudentCard student={child} />
            <div className="mt-2 text-center">
              <span className="text-sm text-green-600 font-semibold hover:underline">
                View Gradebook →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyChildren;
