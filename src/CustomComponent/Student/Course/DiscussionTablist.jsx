import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TabsContent } from "@/components/ui/tabs";
import { DiscussionCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const DiscussionTablist = ({ chapter, lesson }) => {
  const [chapterDiscussion, setChapterDiscussion] = useState([]);
  const [lessonDiscussion, setLessonDiscussion] = useState([]);

  console.log(chapterDiscussion, "chapterDiscussion");
  console.log(lessonDiscussion, "lessonDiscussion");

  const getDiscussionForChapter = async () => {
    try {
      const response = await axiosInstance.get(
        `/discussion/chapter/${chapter._id}`
      );

      setChapterDiscussion(response.data.discussion);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const getDiscussionForLesson = async () => {
    if (!lesson) return;
    try {
      await axiosInstance
        .get(`/discussion/lesson/${lesson._id}`)
        .then((res) => {
          setLessonDiscussion(res.data.discussion);
        });
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  useEffect(() => {
    getDiscussionForChapter();
    getDiscussionForLesson();
  }, [lesson]);

  return (
    <section>
      <TabsContent
        value="Discussions"
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Chapter Discussion
        </p>
        {chapterDiscussion?.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">
            No Discussion found for this chapter
          </p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapterDiscussion?.map((discussion) => (
              <>
                <DiscussionCard
                  key={discussion._id}
                  discussion={discussion}
                  link={`/student/discussions/${discussion._id}`}
                />
              </>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Lesson Discussion
          </p>

          {lessonDiscussion?.length === 0 || !lesson ? (
            <p className="text-sm text-gray-500 mt-4">
              No discussion found for this Lesson
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonDiscussion?.map((discussion) => (
                <>
                  <DiscussionCard
                    key={discussion._id}
                    discussion={discussion}
                    link={`/student/discussions/${discussion._id}`}
                  />
                </>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </section>
  );
};

export default DiscussionTablist;
