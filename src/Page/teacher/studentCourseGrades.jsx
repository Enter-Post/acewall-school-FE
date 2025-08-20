"use client"

import { axiosInstance } from "@/lib/AxiosInstance"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"

const StudentCourseGrades = () => {
  const { studentId, courseId } = useParams()
  const [gradeData, setGradeData] = useState(null)
  const [expandedSubjectId, setExpandedSubjectId] = useState(null)
  const [expandedSemesters, setExpandedSemesters] = useState(new Set())
  const [expandedQuarters, setExpandedQuarters] = useState(new Set())

  const toggleSubjectExpand = (courseId) => {
    if (expandedSubjectId === courseId) {
      setExpandedSubjectId(null)
    } else {
      setExpandedSubjectId(courseId)
    }
  }

  const toggleSemesterExpand = (semesterId) => {
    const newExpanded = new Set(expandedSemesters)
    if (newExpanded.has(semesterId)) {
      newExpanded.delete(semesterId)
    } else {
      newExpanded.add(semesterId)
    }
    setExpandedSemesters(newExpanded)
  }

  const toggleQuarterExpand = (quarterId) => {
    const newExpanded = new Set(expandedQuarters)
    if (newExpanded.has(quarterId)) {
      newExpanded.delete(quarterId)
    } else {
      newExpanded.add(quarterId)
    }
    setExpandedQuarters(newExpanded)
  }

  const groupAssessmentsByCategory = (assessments) => {
    const grouped = {}
    assessments.forEach((assessment) => {
      const category = assessment.category || "Other"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(assessment)
    })
    return grouped
  }

  useEffect(() => {
    const fetchStudentGradeforCourse = async () => {
      try {
        const res = await axiosInstance.get(`gradebook/getGradebook/${studentId}/${courseId}`)
        console.log(res)
        setGradeData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchStudentGradeforCourse()
  }, [studentId, courseId])

  const tableHead = ["Course", "Average", "Grade"]

  if (!gradeData) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-white shadow-md rounded-2xl transition duration-300 hover:shadow-lg">
        <h2 className="font-extrabold text-2xl text-gray-800 mb-2">{gradeData?.course?.courseTitle}</h2>

        {gradeData?.course?.thumbnail?.url && (
          <div className="overflow-hidden rounded-lg flex justify-center">
            <img
              src={gradeData.course.thumbnail.url || "/placeholder.svg"}
              alt="Course Thumbnail"
              className="w-[300px] h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        {gradeData?.course?.courseDescription && (
          <p className="text-gray-600 mt-4 text-base leading-relaxed">{gradeData.course.courseDescription}</p>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHead.map((item, idx) => (
                <TableHead key={idx}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="text-xs md:text-sm">
              <TableCell
                className="cursor-pointer hover:text-green-600 flex items-center gap-2 font-medium"
                onClick={() => toggleSubjectExpand(courseId)}
              >
                {expandedSubjectId === courseId ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span>{gradeData?.courseName}</span>
              </TableCell>
              <TableCell>{gradeData?.grade?.toFixed(2)}%</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    gradeData?.letterGrade === "A" || gradeData?.letterGrade === "A-" || gradeData?.letterGrade === "A+"
                      ? "bg-green-100 text-green-800"
                      : gradeData?.letterGrade === "B" ||
                          gradeData?.letterGrade === "B-" ||
                          gradeData?.letterGrade === "B+"
                        ? "bg-blue-100 text-blue-800"
                        : gradeData?.letterGrade === "C" ||
                            gradeData?.letterGrade === "C-" ||
                            gradeData?.letterGrade === "C+"
                          ? "bg-yellow-100 text-yellow-800"
                          : gradeData?.letterGrade === "D" ||
                              gradeData?.letterGrade === "D-" ||
                              gradeData?.letterGrade === "D+"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {gradeData?.letterGrade}
                </span>
              </TableCell>
            </TableRow>
            {expandedSubjectId === courseId && (
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="p-0">
                  <div className="p-4 space-y-6">
                    {gradeData?.semesters?.map((semester) => (
                      <div key={semester.semesterId} className="space-y-4">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 font-medium text-lg"
                          onClick={() => toggleSemesterExpand(semester.semesterId)}
                        >
                          {expandedSemesters.has(semester.semesterId) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <span>{semester.semesterTitle}</span>
                        </div>

                        {expandedSemesters.has(semester.semesterId) && (
                          <div className="ml-6 space-y-4">
                            {semester.quarters?.map((quarter) => (
                              <div key={quarter.quarterId} className="space-y-2">
                                <div
                                  className="flex items-center gap-2 cursor-pointer hover:text-green-600 font-medium"
                                  onClick={() => toggleQuarterExpand(quarter.quarterId)}
                                >
                                  {expandedQuarters.has(quarter.quarterId) ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                  )}
                                  <span>{quarter.quarterTitle}</span>
                                </div>

                                {expandedQuarters.has(quarter.quarterId) && (
                                  <div className="ml-6">
                                    {(() => {
                                      const groupedAssessments = groupAssessmentsByCategory(quarter.assessments || [])
                                      return Object.entries(groupedAssessments).map(([category, assessments]) => (
                                        <AssessmentTable
                                          key={`${quarter.quarterId}-${category}`}
                                          title={category}
                                          items={assessments}
                                          isFinal={category.toLowerCase().includes("final")}
                                        />
                                      ))
                                    })()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {(!gradeData?.semesters || gradeData.semesters.length === 0) && (
                      <div className="text-center py-6 text-gray-500">No assessments found for this course.</div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const AssessmentTable = ({ title, items = [], isFinal = false }) => {
  if (!items || items.length === 0) {
    return <div className="text-sm text-gray-500 italic mb-4">No {title.toLowerCase()} available</div>
  }

  return (
    <div className="space-y-2 mb-6">
      <h4 className="font-medium text-sm text-gray-700">{title}</h4>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs">Assessment</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs">Score</TableHead>
              <TableHead className="text-xs">Max Points</TableHead>
              <TableHead className="text-xs">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const percentage = item.maxPoints > 0 ? ((item.studentPoints / item.maxPoints) * 100).toFixed(1) : 0
              return (
                <TableRow key={`${item.assessmentId}-${index}`} className="text-xs">
                  <TableCell className="font-medium">{item.assessmentTitle}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.studentPoints}</TableCell>
                  <TableCell>{item.maxPoints}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        percentage >= 90
                          ? "bg-green-100 text-green-800"
                          : percentage >= 80
                            ? "bg-blue-100 text-blue-800"
                            : percentage >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : percentage >= 60
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default StudentCourseGrades
