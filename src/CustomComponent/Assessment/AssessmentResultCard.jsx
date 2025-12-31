"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const AssessmentResultCard = ({ submission }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div
              className="flex flex-wrap items-center gap-2"
              role="status"
              aria-live="polite"
            >
              <Badge
                variant={
                  submission?.status === "before due date"
                    ? "success"
                    : "destructive"
                }
                aria-label={`Submission status: ${submission?.status}`}
              >
                {submission?.status}
              </Badge>
              <Badge
                variant={submission?.graded ? "outline" : "secondary"}
                aria-label={submission?.graded ? "Graded" : "Needs grading"}
              >
                {submission?.graded ? "Graded" : "Needs Grading"}
              </Badge>
            </div>
            <CardDescription>
              Submitted on: {formatDate(submission?.createdAt)}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <section aria-labelledby="assessment-summary">
            <h3 id="assessment-summary" className="text-lg font-semibold mb-2">
              Assessment Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
              <div>
                <p className="text-sm text-muted-foreground">Assessment ID</p>
                <p className="font-medium">{submission?.assessment}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Current {submission?.totalScore > 1 ? "Points" : "Point"}
                </p>
                <p className="font-medium" aria-live="polite">
                  {submission?.totalScore || 0} points
                </p>
              </div>
            </div>
          </section>

          <Tabs
            defaultValue="all"
            className="w-full"
            aria-label="Assessment answers tabs"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All Questions ({submission?.answers?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="manual">
                Needs Grading (
                {submission?.answers?.filter((a) => a.requiresManualCheck)
                  ?.length || 0}
                )
              </TabsTrigger>
              <TabsTrigger value="auto">
                Graded (
                {submission?.answers?.filter((a) => !a.requiresManualCheck)
                  ?.length || 0}
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-6">
                {submission?.answers?.map((answer, index) => (
                  <QuestionCard
                    key={answer._id || index}
                    answer={answer}
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <div className="space-y-6">
                {submission?.answers
                  ?.filter((a) => a.requiresManualCheck)
                  .map((answer, index) => (
                    <QuestionCard
                      key={answer._id || index}
                      answer={answer}
                      index={index}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="auto">
              <div className="space-y-6">
                {submission?.answers
                  ?.filter((a) => !a.requiresManualCheck)
                  .map((answer, index) => (
                    <QuestionCard
                      key={answer._id || index}
                      answer={answer}
                      index={index}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const QuestionCard = ({ answer, index }) => {
  const questionType = answer?.question?.type || "unknown";
  const maxPoints = answer?.question?.points || 0;

  const typeLabel =
    questionType === "mcq"
      ? "Multiple Choice"
      : questionType === "truefalse"
      ? "True/False"
      : questionType === "qa"
      ? "Question & Answer"
      : questionType === "file"
      ? "File Upload"
      : "Unknown";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Question {index + 1}</CardTitle>
            <CardDescription>{typeLabel}</CardDescription>
          </div>
          <div
            className="flex items-center space-x-2"
            role="status"
            aria-live="polite"
          >
            {answer?.requiresManualCheck ? (
              <Badge
                variant="warning"
                className="bg-amber-100 text-amber-800 hover:bg-amber-100"
              >
                <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                Needs Manual Grading
              </Badge>
            ) : answer?.isCorrect ? (
              <Badge
                variant="success"
                className="bg-green-100 text-green-800 hover:bg-green-100"
              >
                <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                Correct
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="bg-red-100 text-red-800 hover:bg-red-100"
              >
                <XCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                Incorrect
              </Badge>
            )}
            <Badge variant="outline">
              {`${answer?.pointsAwarded || 0}/${maxPoints} points`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div role="region" aria-label={`Question ${index + 1} content`}>
            <h4 className="font-medium mb-2">Question:</h4>
            <div
              className="p-3 bg-slate-50 rounded-md"
              dangerouslySetInnerHTML={{
                __html: answer?.question?.question || "",
              }}
            />
          </div>

          <div
            role="region"
            aria-label={`Question ${index + 1} student's answer`}
          >
            <h4 className="font-medium mb-2">Student's Answer:</h4>
            <div className="p-3 bg-slate-50 rounded-md">
              {questionType === "truefalse" ? (
                <span className="font-medium">
                  {answer?.selectedAnswer === "true" ? "True" : "False"}
                </span>
              ) : questionType === "mcq" ? (
                <span className="font-medium">
                  Option: {answer?.selectedAnswer}
                </span>
              ) : questionType === "file" ? (
                <div className="space-y-2">
                  {answer?.file?.map((file, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <FileText
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                      />
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900"
                        aria-label={`Download file ${file.filename}`}
                      >
                        {file.filename}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: answer?.selectedAnswer || "",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentResultCard;
