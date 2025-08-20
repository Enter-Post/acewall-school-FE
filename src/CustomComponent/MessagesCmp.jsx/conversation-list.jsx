import { Loader, Plus, Search } from "lucide-react";
import ConversationItem from "./conversation-item";
// import { conversations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";
import TeacherDropdown from "../Student/createConversationDropdown";

export default function ConversationList({
  activeConversation,
  setActiveConversation,
}) {
  const [conversations, setConversations] = useState();
  const { user, currentConversation, setCurrentConversation } =
    useContext(GlobalContext);
  const [teacher, setTeacher] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConversations = () => {
    axiosInstance
      .get("/conversation/get-updated")
      .then((res) => {
        setConversations(res.data.conversations);
        console.log(res, "res");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getConversations();
  }, []);

  const handleActiveConversation = async (id) => {
    setActiveConversation(id);
  };

  const fetchCoursesbystudent = async () => {
    await axiosInstance
      .get(`/conversation/getTeacherforStudent`)
      .then((res) => {
        setTeacher(res.data.teachers);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCoursesbystudent();
  }, []);

  return (
    <div className="flex flex-col h-full hide-scrollbar p-4">
      {user.role === "student" && (
        <TeacherDropdown
          teachers={teacher}
          getConversations={getConversations}
        />
      )}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <section className="flex justify-center items-center h-full w-full">
            <Loader className="animate-spin " />
          </section>
        </div>
      )}

      {conversations && conversations.length > 0 ? (
        <div className="overflow-y-auto gap-3 flex flex-wrap mt-4">
          {conversations.map((conversation) => (
            <Link
              onClick={() => setCurrentConversation(conversation)}
              to={
                user.role === "student"
                  ? `/student/messages/${conversation.conversationId}`
                  : `/teacher/messages/${conversation.conversationId}`
              }
              key={conversation._id}
            >
              <ConversationItem conversation={conversation} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No conversations found.
        </div>
      )}
    </div>
  );
}
