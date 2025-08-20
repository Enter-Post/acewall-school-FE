import React from "react";
import { Link } from "react-router-dom";
import acewallshort from "../../assets/acewallshort.png";
const DiscussionTabContent = ({ discussions, loading }) => {
  return (
    <div>
      <div className="w-full flex justify-center">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : discussions.length === 0 ? (
          <p className="text-center">No Discussions</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {!loading &&
          discussions.map((item) => (
            <Link
              key={item._id}
              to={`/student/discussions/${item._id}`}
              className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 p-4 bg-white group"
            >
              {/* ✅ Thumbnail or Default for Public */}
              {item?.course?.thumbnail?.url ? (
                <div className="overflow-hidden rounded-md mb-2">
                  <img
                    src={item.course.thumbnail.url}
                    alt={item.topic || "Course Thumbnail"}
                    className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
                  />
                </div>
              ) : item?.type === "public" ? (
                <div className="overflow-hidden flex justify-center w-full rounded-md mb-2">
                  <img
                    src={acewallshort}
                    alt="Default Public"
                    className="w-40 h-full bg-center "
                  />
                </div>
              ) : null}

              {item.dueDate && (
                <div className="flex items-center gap-2 text-xs mt-1">
                  <p className="text-gray-600 font-bold">Due Date:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500">
                      {item.dueDate.date
                        ? new Date(item.dueDate.date).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-gray-500">
                      {item.dueDate.time
                        ? item.dueDate.time.slice(0, 5)
                        : ""}
                    </p>
                  </div>
                </div>
              )}

              {/* Type Badge */}
              <div
                className={`border w-fit px-2 py-1 rounded-full border-gray-200 m-2 ${
                  item?.type === "public" ? "bg-green-600" : "bg-indigo-600"
                }`}
              >
                <p className="text-xs text-white">{item?.type}</p>
              </div>

              {/* Metadata */}
              <div className="flex justify-between items-center mt-3">
                <h2 className="font-semibold text-lg text-gray-800 truncate">
                  {item?.topic}
                </h2>
                <span className="text-xs text-gray-500">
                  {new Date(item?.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-indigo-700 font-medium">
                {item?.course?.courseTitle}
              </p>

              <p className="text-sm text-gray-700 line-clamp-2">
                {item?.description}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default DiscussionTabContent;
