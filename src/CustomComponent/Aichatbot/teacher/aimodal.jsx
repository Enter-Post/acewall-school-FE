"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Check, RotateCcw, Pencil } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function AiContentModal({
  command,
  aiResponse,
  setAiResponse,
  usedfor,
  setValue,
  appendTeachingPoint,
  removeTeachingPoint,
  appendRequirement,
  removeRequirement,
  handleEditorChange,
  questionType,
  prevPoints,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [QuestionDifficulty, setQuestionDifficulty] = useState("medium");

  /* ------------------ Render Content ------------------ */
  const renderGeneratedContent = (content) => {
    if (!content) return null;

    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const isBulletList = lines.every((line) => /^[-•*]/.test(line));

    if (isBulletList) {
      return (
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^[-•*]\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-gray-700">
            {line}
          </p>
        ))}
      </div>
    );
  };

  /* ------------------ Generate ------------------ */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    const splitedUsedfor = usedfor.split(".");
    const finalUsedfor =
      splitedUsedfor[0] === "questions" ? `question-${questionType}` : usedfor;

    try {
      const res = await axiosInstance.post("aichat/generateContentForTeacher", {
        command: prompt,
        usedfor: finalUsedfor,
        difficulty: QuestionDifficulty,
      });

      setGeneratedContent(res.data.content);
      setShowResult(true);
    } catch (err) {
      console.error("AI generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ------------------ Accept / Reject ------------------ */
  const handleAccept = () => {
    const split = usedfor.split(".");

    if (usedfor === "lessonDescription") {
      handleEditorChange(generatedContent);
    } else {
      setValue(usedfor, generatedContent);
    }

    setIsOpen(false);
    resetState();
  };

  const handleReject = () => {
    setShowResult(false);
    setGeneratedContent("");
  };

  const resetState = () => {
    setPrompt("");
    setGeneratedContent("");
    setShowResult(false);
    setIsGenerating(false);
  };

  const handleClose = (open) => {
    setIsOpen(open);
    if (!open) resetState();
  };

  const difficultyStyles = {
    easy: "border-green-400 bg-green-400",
    medium: "border-orange-400 bg-orange-400",
    hard: "border-red-400 bg-red-400",
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI content generator"
        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">Open AI assistant</span>
      </button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-xl"
          aria-describedby="ai-generator-description"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center"
                aria-hidden="true"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span>AI Assistant</span>
            </DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="py-4" aria-live="polite">
            {!showResult ? (
              <div className="text-center space-y-6">
                {!isGenerating ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Start writing to generate content
                    </h3>

                    {(questionType === "mcq" ||
                      questionType === "truefalse" ||
                      questionType === "qa") && (
                      <fieldset>
                        <legend className="sr-only">Question difficulty</legend>
                        <div className="flex justify-center gap-4">
                          {["easy", "medium", "hard"].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setQuestionDifficulty(level)}
                              aria-pressed={QuestionDifficulty === level}
                              className={`px-3 py-1 rounded-lg border text-sm ${
                                QuestionDifficulty === level
                                  ? `${difficultyStyles[level]} text-white`
                                  : "border-gray-300"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    <label htmlFor="ai-prompt" className="sr-only">
                      AI prompt
                    </label>
                    <Input
                      id="ai-prompt"
                      placeholder="Describe what you want to create..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />

                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    >
                      <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                      Generate
                    </Button>
                  </>
                ) : (
                  <Loader2
                    className="w-8 h-8 mx-auto animate-spin text-emerald-500"
                    aria-label="Generating content"
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 border rounded-lg p-4 max-h-[250px] overflow-y-auto">
                  {renderGeneratedContent(generatedContent)}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Regenerate
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" aria-hidden="true" />
                    Edit
                  </Button>

                  <Button
                    onClick={handleAccept}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
                  >
                    <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                    Go with it
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
