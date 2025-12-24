"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Settings, X, Loader2, Check, RotateCcw } from "lucide-react";
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  /* ----------------------------------
   AI CONTENT RENDERER (KEY PART)
----------------------------------- */
  const renderGeneratedContent = (content) => {
    if (!content) return null;

    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const isBulletList = lines.every(
      (line) =>
        line.startsWith("-") || line.startsWith("•") || line.startsWith("*")
    );

    if (isBulletList) {
      return (
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          {lines.map((line, index) => (
            <li key={index}>{line.replace(/^[-•*]\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {lines.map((line, index) => (
          <p key={index} className="text-sm text-gray-700 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    );
  };

  /* ---------------------------------- */

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await axiosInstance.post(
        "aichat/generateContentForTeacher",
        { command: prompt, usedfor }
      );

      setGeneratedContent(response.data.content);
      setShowResult(true);
    } catch (error) {
      console.error("AI generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const parsePointsFromAI = (content) => {
    if (!content) return [];

    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.startsWith("-") || line.startsWith("•") || line.startsWith("*")
      )
      .map((line) => line.replace(/^[-•*]\s*/, ""))
      .filter(Boolean)
      .slice(0, 8); // optional limit
  };

  const insertPointsFromAI = (content) => {
    const points = parsePointsFromAI(content);

    if (!points.length) return;

    // Remove existing fields
    if (usedfor === "teachingPoints") {
      removeTeachingPoint();
    } else if (usedfor === "requirements") {
      removeRequirement();
    }

    // Append new ones
    points.forEach((point) => {
      if (usedfor === "teachingPoints") {
        appendTeachingPoint({ value: point });
      } else if (usedfor === "requirements") {
        appendRequirement({ value: point });
      }
    });
  };

  const handleAccept = () => {
    if (usedfor === "teachingPoints") {
      insertPointsFromAI(generatedContent);
    } else if (usedfor === "requirements") {
      insertPointsFromAI(generatedContent);
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

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(true)}
        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer select-none"
      >
        <Sparkles className="w-4 h-4" />
      </div>

      {isOpen && (
        <div className="absolute left-90 top-full mt-2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-gray-100 rounded-md"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {!showResult ? (
              <div className="text-center space-y-6">
                {!isGenerating && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Start writing to make the magic happen.
                    </h3>
                    <p className="text-sm text-gray-500">
                      Suggestions will appear here.
                    </p>

                    <Input
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
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </>
                )}

                {isGenerating && (
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500" />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Generated Content */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[250px] overflow-y-auto">
                  {renderGeneratedContent(generatedContent)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Insert
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
