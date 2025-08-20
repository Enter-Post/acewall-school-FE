"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  Upload,
  FileText,
  Calendar,
  Clock,
  Loader,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const tableHead = ["Assessment Name", "Course", "Due Date", "Status", "Type"];

const Assessment = () => {
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [expandedAssessmentId, setExpandedAssessmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      await axiosInstance
        .get("assessment/getAllassessmentforStudent")
        .then((res) => {
          setAssessments(res.data);
          console.log("data assess",res);
          
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch assessments");
          setLoading(false);
        });
    };

    fetchAssessment();
  }, []);

  const formatDueDate = (date, time) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
      return `${format(dateObj, "MMM dd, yyyy")} at ${time || "N/A"}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const filteredAssessments = Array.isArray(assessments)
    ? assessments.filter((assessment) =>
        assessment?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const toggleAssessmentExpand = (assessmentId) => {
    setExpandedAssessmentId(
      expandedAssessmentId === assessmentId ? null : assessmentId
    );
  };

  const getStatusLabel = (isSubmitted) =>
    isSubmitted ? "Submitted" : "Pending";

  const getStatusClass = (isSubmitted) =>
    isSubmitted
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div>
      <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        Assessment
      </p>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHead.map((item, idx) => (
                  <TableHead key={idx}>{item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => (
                  <React.Fragment key={assessment._id}>
                    <TableRow className="text-xs md:text-sm">
                      <TableCell
                        className="cursor-pointer hover:text-blue-600 flex items-center gap-2"
                        onClick={() => toggleAssessmentExpand(assessment._id)}
                      >
                        {expandedAssessmentId === assessment._id ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <span
                          className={
                            expandedAssessmentId === assessment._id
                              ? "font-medium"
                              : ""
                          }
                        >
                          {assessment.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        {assessment?.course?.courseTitle || "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatDueDate(
                          assessment?.dueDate?.date,
                          assessment?.dueDate?.time
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                            assessment.isSubmitted
                          )}`}
                        >
                          {getStatusLabel(assessment.isSubmitted)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">
                          {assessment.type?.replace("-", " ") || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>

                    {expandedAssessmentId === assessment._id && (
                      <TableRow className="bg-gray-50 border">
                        <TableCell colSpan={5} className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Description
                              </h4>
                              <p className="text-sm text-gray-600">
                                {assessment.description ||
                                  "No description provided."}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Course
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  {assessment?.course?.courseTitle || "N/A"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Due Date
                                </h4>
                                <div className="flex flex-col space-y-1">
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    {assessment?.dueDate?.date &&
                                    !isNaN(
                                      new Date(
                                        assessment.dueDate.date
                                      ).getTime()
                                    )
                                      ? format(
                                          new Date(assessment.dueDate.date),
                                          "MMMM dd, yyyy"
                                        )
                                      : "Invalid date"}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    {assessment?.dueDate?.time || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Link
                              to={`/student/assessment/submission/${assessment._id}`}
                              className="pt-2"
                            >
                              <Button
                                className="bg-green-500 hover:bg-green-600 text-white"
                                size="sm"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {assessment.isSubmitted
                                  ? "See Results"
                                  : "Submit Assessment"}
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {search
                      ? "No assessments found matching your search."
                      : "No assessments available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Assessment;
