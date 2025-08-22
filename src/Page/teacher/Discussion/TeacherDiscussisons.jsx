import { CreateDiscussionDialog } from "@/CustomComponent/createDiscussionModal";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import BackButton from "@/CustomComponent/BackButton";
import { DiscussionCard } from "@/CustomComponent/Card";

const TeacherDiscussion = () => {
  const [discussion, setDiscussion] = useState([]);
  const [loading, setloading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("course");

  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const typeId = searchParams.get("typeId");
  const courseId = searchParams.get("course");

  const { semesterId, quarterId } = useParams();

  console.log(discussion, "discussion");

  useEffect(() => {
    const fetchDiscussions = async () => {
      setloading(true);
      try {
        const res = await axiosInstance.get(`/discussion/${type}/${typeId}`); 
        console.log(res, "Teacher Discussion Data");
        setDiscussion(res.data.discussion);
      } catch (err) {
        // handle error if needed
      } finally {
        setloading(false);
      }
    };
    fetchDiscussions();
  }, [refresh]);

  return (
    <div>
      <div className="mb-3">
        <BackButton />
      </div>

      <div className="flex flex-col pb-2 gap-5">
        <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
          Discussions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <section className="flex justify-between">
          <div className="flex justify-end pb-5">
            <CreateDiscussionDialog
              setRefresh={setRefresh}
              refresh={refresh}
              semester={semesterId}
              quarter={quarterId}
            />
          </div>
        </section>

        <div className="w-full flex justify-center">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : discussion?.length === 0 ? (
            <p className="text-center">No Discussion found</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {!loading &&
            discussion?.map((item) => (
              <DiscussionCard
                key={item._id}
                discussion={item}
                link={`/teacher/discussions/${semesterId}/${quarterId}/${item._id}`}
              />

              // <Link
              //   key={item._id}
              //   to={`/teacher/discussions/${semesterId}/${quarterId}/${item._id}`}
              //   className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 p-4 bg-white group"
              // >
              //   {item?.course?.thumbnail?.url && (
              //     <div className="overflow-hidden rounded-md">
              //       <img
              //         src={item.course.thumbnail.url}
              //         alt={item.topic || "Course Thumbnail"}
              //         className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
              //       />
              //     </div>
              //   )}
              //   <div
              //     className={`border w-fit px-2 py-1 rounded-full border-gray-200 m-2 bg-indigo-600`}
              //   >
              //     <p className={`text-xs text-white`}>{item?.type}</p>
              //   </div>

              //   <div className="flex justify-between items-center mt-3">
              //     <h2 className="font-semibold text-lg text-gray-800 truncate">
              //       {item?.topic}
              //     </h2>
              //     <span className="text-xs text-gray-500">
              //       {new Date(item?.createdAt).toLocaleDateString()}
              //     </span>
              //   </div>

              //   <p className="text-sm text-indigo-700 font-medium">
              //     {item?.course?.courseTitle}
              //   </p>

              //   <p className="text-sm text-gray-700 line-clamp-2">
              //     {item?.description}
              //   </p>
              // </Link>
            ))}
        </div>
      </Tabs>
    </div>
  );
};

export default TeacherDiscussion;
