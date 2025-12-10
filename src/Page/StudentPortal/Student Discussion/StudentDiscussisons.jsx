import DiscussionTabContent from "@/CustomComponent/Student/DiscussionTabContent";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";

const StudentDiscussion = () => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/discussion/studentDiscussion");
        setDiscussions(res.data.discussions || []);
      } catch {
        setDiscussions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, [refresh]);

  return (
    <main className="md:p-6" aria-label="Student Discussions Page">
      {/* Header */}{" "}
      <h1
        className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg"
        tabIndex={-1}
      >
        Discussions{" "}
      </h1>
      <section
        className="flex flex-col pb-2 gap-5"
        aria-label="Student discussion list"
        aria-busy={loading}
      >
        {/* Existing Tab Content */}
        <DiscussionTabContent loading={loading} discussions={discussions} />
      </section>
    </main>
  );
};

export default StudentDiscussion;
