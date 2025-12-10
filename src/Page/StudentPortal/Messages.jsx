import ConversationList from "@/CustomComponent/MessagesCmp.jsx/conversation-list";

const Messages = () => {
  return (
    <main className="md:p-6" aria-label="Messages page">
      <h1
        className="text-2xl font-bold py-4 px-6 mb-6 bg-acewall-main text-white rounded-xl shadow-md"
        tabIndex={-1}
      >
        Messages
      </h1>

      <section
        className="max-w-6xl mx-auto"
        aria-label="Conversations container"
      >
        <div className="bg-white rounded-2xl">
          <div className="flex h-full w-full">
            <div className="h-full w-full">
              <ConversationList />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Messages;
