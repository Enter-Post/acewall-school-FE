import { GlobalContext } from "@/Context/GlobalProvider";
import ChatBox from "@/CustomComponent/Discussion/ChatBox";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Files } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StudentDiscussionChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`discussion/${id}`);
        setDiscussion(res.data.discussion);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussion();
  }, [id]);

  const openModal = (file) => {
    setModalContent(file);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  if (loading) {
    return (
      <main className="p-6" aria-busy="true" aria-live="polite">
        {" "}
        <p>Loading discussion...</p>{" "}
      </main>
    );
  }

  if (!discussion) {
    return (
      <main className="p-6">
        {" "}
        <p>Discussion not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          ← Back{" "}
        </button>{" "}
      </main>
    );
  }

  return (
    <main
      className="flex flex-col gap-4 p-6"
      aria-label="Student Discussion Chat"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 transition w-fit"
        aria-label="Go back"
      >
        ← Back{" "}
      </button>

      <section className="py-4 mb-6 pl-6 rounded-lg bg-green-600 text-white">
        <h1 className="text-2xl font-bold">{discussion.topic}</h1>
      </section>

      <section
        className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white mb-4"
        aria-label="Discussion details"
      >
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <p
            className="text-xs text-gray-600 font-semibold"
            aria-label="Due Date"
          >
            📅 Due Date:{" "}
            <span className="text-gray-500">
              {discussion?.dueDate?.date
                ? new Date(discussion.dueDate.date).toLocaleDateString()
                : "N/A"}{" "}
              {discussion?.dueDate?.time
                ? discussion.dueDate.time.slice(0, 5)
                : ""}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div>
            <p className="text-gray-600 font-semibold">📚 Course</p>
            <p className="text-gray-500">
              {discussion?.course?.courseTitle || "Not Assigned"}
            </p>
          </div>
          {discussion?.chapter && (
            <div>
              <p className="text-gray-600 font-semibold">📖 Chapter</p>
              <p className="text-gray-500">
                {discussion?.chapter?.title || "No Chapter"}
              </p>
            </div>
          )}
          {discussion?.lesson && (
            <div>
              <p className="text-gray-600 font-semibold">📖 Lesson</p>
              <p className="text-gray-500">
                {discussion?.lesson?.title || "No Lesson"}
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="text-lg text-gray-600 mb-6">{discussion.description}</p>

      <section
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        aria-label="Discussion attachments"
      >
        {discussion?.files?.map((file, index) => (
          <button
            key={index}
            onClick={() => openModal(file)}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50 hover:bg-white"
            type="button"
            aria-label={`Open file ${file.filename}`}
          >
            {file.type === "application/pdf" ? (
              <>
                <Files className="h-6 w-6 text-red-500" />
                <span className="text-sm font-medium text-blue-700 truncate">
                  {file.filename}
                </span>
              </>
            ) : (
              <>
                <img
                  src={file.url}
                  alt={file.filename}
                  className="h-10 w-10 object-cover rounded-md"
                />
                <span className="text-sm font-medium text-blue-700 truncate">
                  {file.filename}
                </span>
              </>
            )}
          </button>
        ))}
      </section>

      <ChatBox discussionId={id} />

      {modalOpen && modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of file ${modalContent.filename}`}
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto"
          >
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-900 float-right text-xl font-bold mb-2"
              aria-label="Close file preview modal"
            >
              ×
            </button>

            {modalContent.type === "application/pdf" ? (
              <iframe
                src={modalContent.url}
                title={modalContent.filename}
                className="w-full h-[80vh]"
              />
            ) : (
              <img
                src={modalContent.url}
                alt={modalContent.filename}
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default StudentDiscussionChat;
