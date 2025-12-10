import React, { useEffect, useState } from "react";
import { AnnouncementCard } from "@/CustomComponent/Card";
import oopsImage from "@/assets/oopsimage.png";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext } from "react";
import { GlobalContext } from "../../Context/GlobalProvider";
import { Loader } from "lucide-react";
const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(GlobalContext);
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/announcements/getbystudent/${user?._id}`);
        setAnnouncements(response.data.announcements || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);
  const transformedData = announcements.map((a) => {
  const created = new Date(a.createdAt);
  return {
    title: a.title,
    message: a.message,
    course: a.course?.courseTitle ?? 'Unknown Course',
    date: created.toLocaleDateString(), // e.g., "5/21/2025"
    time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // e.g., "09:01 PM"
  };
});

  return (
    <section className="p-3 md:p-0">
      <div className="flex flex-col pb-2 gap-5">
        <h1 className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
          Announcements
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin"/>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-semibold text-muted-foreground">
            No announcements available
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            When announcements are posted, they will appear here.
          </p>
          <img
            src={oopsImage}
            alt="No announcements"
            className="w-full max-w-md h-80 object-contain mt-6"
          />
        </div>
      ) : (
        <div className="overflow-hidden">
          <AnnouncementCard mainHeading={"Latest Announcements"} data={transformedData} />
        </div>
      )}
    </section>
  );
};

export default Announcement;
