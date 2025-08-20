"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  FileText,
  Youtube,
  Link2,
  GraduationCap,
  Loader,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import LessonModal from "@/CustomComponent/CreateCourse/LessonModal";
import EditLessonModal from "@/CustomComponent/CreateCourse/EditLesson";
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal";
// import { AssessmentDialog } from "./assessment-dialog";
import EditChapterDialog from "@/CustomComponent/CreateCourse/EditChapter";
import AddMoreFile from "@/CustomComponent/CreateCourse/addMoreFile";
import { ChapterCard } from "./chapter-card";
import { AssessmentDialog } from "../Models/AssessmentFields";
import ChapterOptionDropdown from "@/CustomComponent/teacher/OptionDropdown";

const TeacherChapterDetail = () => {
  const { chapterId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get("courseId");
  const quarterStart = searchParams.get("quarterStart");
  const quarterEnd = searchParams.get("quarterEnd");

  const [loading, setLoading] = useState(false);
  const [chapter, setChapter] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [editChapterLoading, setEditChapterLoading] = useState(false); // Add this state

  const fetchChapterDetail = async () => {
    try {
      const response = await axiosInstance.get(
        `chapter/chapter/chapter&lessons/${chapterId}`
      );
      setChapter(response.data.chapter);
      setLessons(response.data.chapter.lessons || []);
      console.log(response.data.chapter.lessons, "chapter lessons");

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
    }
  }, [chapterId, editChapterLoading]);

  const handleDeleteLesson = async (lessonID) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`lesson/${lessonID}`);
      toast.success(response.data.message);
      fetchChapterDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentID) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/assessment/delete/${assessmentID}`
      );
      toast.success(response.data.message);
      fetchChapterDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, lessonId) => {
    await axiosInstance
      .delete(`lesson/delete/${lessonId}/${fileId}`)
      .then((res) => {
        toast.success(res.data.message);
        fetchChapterDetail();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Error deleting file");
      });
  };

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader className="animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading chapter details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-1">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <section className="flex justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {chapter.title}
                  </h1>
                  <p className="text-gray-600">{chapter.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <EditChapterDialog
                chapterId={chapter._id}
                title={chapter.title}
                description={chapter.description}
                fetchChapterDetail={fetchChapterDetail}
                editChapterLoading={editChapterLoading}
                setEditChapterLoading={setEditChapterLoading}
              />
              <ChapterOptionDropdown
                type={"chapter"}
                typeId={chapter._id}
                fetchChapterDetail={fetchChapterDetail}
                quarterId={chapter.quarter?._id}
                semesterId={chapter.semester?._id}
                quarterStart={quarterStart}
                quarterEnd={quarterEnd}
                courseId={courseId}
              />
            </div>
          </section>
        </div>

        {/* Chapter Assessments */}
        {chapter.chapter_assessments &&
          chapter.chapter_assessments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-orange-600" />
                  Chapter Assessments
                  <Badge variant="secondary">
                    {chapter.chapter_assessments.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapter.chapter_assessments.map((assessment) => (
                    <div
                      key={assessment._id}
                      className="border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col items-start justify-between mb-2 gap-5 p-4">
                        <section className="flex justify-between w-full">
                          <Badge variant="outline" className="mb-2">
                            {assessment.category.name}
                          </Badge>
                          <DeleteModal
                            deleteFunc={() =>
                              handleDeleteAssessment(assessment._id)
                            }
                          />
                        </section>
                        <Link
                          to={`/teacher/courses/assessment/${assessment._id}`}
                          className="w-full hover:bg-gray-200 p-4 rounded-lg transform transition-transform duration-300"
                        >
                          <h4 className="font-semibold text-gray-900">
                            {assessment.title}
                          </h4>
                          {assessment.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {assessment.description}
                            </p>
                          )}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Lessons
              <Badge variant="secondary">{lessons.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No lessons yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first lesson to start building your chapter
                  content.
                </p>
                <LessonModal
                  chapterID={chapterId}
                  fetchChapterDetail={fetchChapterDetail}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <Card
                    key={lesson._id}
                    className="border-l-4 border-l-blue-400"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex gap-3 flex-wrap items-start justify-between">
                        <section className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            Lesson {index + 1}
                          </Badge>
                          <h4 className="font-semibold text-gray-900">
                            {lesson.title}
                          </h4>
                        </section>
                        <section className="flex items-center gap-2 flex-wrap gap-1">
                          <EditLessonModal
                            lesson={lesson}
                            fetchChapterDetail={fetchChapterDetail}
                          />
                          <DeleteModal
                            deleteFunc={() => handleDeleteLesson(lesson._id)}
                          />
                          <Link
                            to={`/teacher/assessments/create/lesson/${lesson._id}/${courseId}/${quarterStart}/${quarterEnd}?semester=${chapter.semester?._id}&quarter=${chapter.quarter?._id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 bg-transparent"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Assessment
                            </Button>
                          </Link>
                          <ChapterOptionDropdown
                            type={"lesson"}
                            typeId={lesson._id}
                            fetchChapterDetail={fetchChapterDetail}
                            quarterId={chapter.quarter?._id}
                            semesterId={chapter.semester?._id}
                            quarterStart={quarterStart}
                            quarterEnd={quarterEnd}
                            courseId={courseId}
                          />
                        </section>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {lesson.description && (
                        <p
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: lesson.description,
                          }}
                        />
                      )}

                      <div>
                        <section className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Files
                          </h5>
                          <AddMoreFile
                            lessonId={lesson._id}
                            fetchChapterDetail={fetchChapterDetail}
                          />
                        </section>

                        <div className="flex flex-col gap-2">
                          {lesson.pdfFiles.length === 0 ? (
                            <p className="text-sm text-gray-500">no files</p>
                          ) : (
                            lesson?.pdfFiles?.map(
                              (pdf, i) =>
                                pdf?.url &&
                                pdf?.filename && (
                                  <section
                                    key={i}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0"
                                  >
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={pdf.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors"
                                      >
                                        <FileText className="h-4 w-4" />
                                        {pdf.filename}
                                      </a>

                                      {/* Date formatted in MM/DD/YYYY hh:mm AM/PM */}
                                      {pdf.uploadedAt && (
                                        <span className="text-xs text-gray-500">
                                          {new Date(pdf.uploadedAt).toLocaleString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </span>
                                      )}
                                    </div>

                                    <DeleteModal
                                      what="File"
                                      deleteFunc={() => handleDeleteFile(pdf._id, lesson._id)}
                                    />
                                  </section>
                                )
                            )
                          )}
                        </div>

                      </div>

                      {/* Resources */}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">
                          Resources
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {lesson.youtubeLinks && (
                            <a
                              href={lesson.youtubeLinks}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100 transition-colors"
                            >
                              <Youtube className="h-4 w-4" />
                              YouTube Video
                            </a>
                          )}

                          {lesson.otherLink && (
                            <a
                              href={lesson.otherLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-sm hover:bg-purple-100 transition-colors"
                            >
                              <Link2 className="h-4 w-4" />
                              External Link
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Lesson Assessments */}
                      {lesson.lesson_assessments &&
                        lesson.lesson_assessments.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              Lesson Assessments (
                              {lesson.lesson_assessments.length})
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {lesson.lesson_assessments.map((assessment) => (
                                <div
                                  key={assessment._id}
                                  className="border rounded-lg hover:shadow-sm transition-shadow"
                                >
                                  <div className="flex flex-col items-start justify-between mb-2 gap-5 p-4">
                                    <section className="flex justify-between w-full">
                                      <Badge variant="outline" className="mb-2">
                                        {assessment.category?.name}
                                      </Badge>
                                      <DeleteModal
                                        what="Assessment"
                                        deleteFunc={() =>
                                          handleDeleteAssessment(assessment._id)
                                        }
                                      />
                                    </section>
                                    <Link
                                      to={`/teacher/courses/assessment/${assessment._id}`}
                                      className="w-full hover:bg-gray-200 p-4 rounded-lg transform transition-transform duration-300"
                                    >
                                      <h4 className="font-semibold text-gray-900">
                                        {assessment.title}
                                      </h4>
                                      {assessment.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                          {assessment.description}
                                        </p>
                                      )}
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherChapterDetail;
