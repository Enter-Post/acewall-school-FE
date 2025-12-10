import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const EditParentEmail = ({ studentId, initialEmails = [], onUpdate }) => {
  const [emails, setEmails] = useState(
    initialEmails.length > 0 ? initialEmails : [""]
  );
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const handleAddEmail = () => {
    if (emails.length >= 4) {
      toast.error("You can only add up to 4 emails");
      return;
    }
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index) => {
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated.length > 0 ? updated : [""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validEmails = emails.map((e) => e.trim()).filter((e) => e.length > 0);

    if (validEmails.length === 0) {
      toast.error("Please enter at least one valid email");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.put(
        `/auth/updateParentEmail/${studentId}`,
        {
          guardianEmails: validEmails,
        }
      );

      toast.success(res?.data?.message || "Emails updated successfully");

      if (onUpdate) onUpdate(validEmails);
    } catch (err) {
      console.error("❌ API Error:", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mt-4 p-6 max-w-lg mx-auto bg-gray-50 rounded-lg shadow-md"
      role="region"
      aria-labelledby="edit-parent-email-heading"
    >
      <h2
        id="edit-parent-email-heading"
        className="text-lg font-semibold"
      >
        Edit Parent/Guardian Emails
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Add or update up to 4 parent/guardian email addresses.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <fieldset className="space-y-4" aria-describedby="email-limit-note">
          <legend className="sr-only">Parent or guardian email addresses</legend>

          {emails.map((email, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="w-full">
                <label
                  htmlFor={`email-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Parent/Guardian Email {index + 1}
                </label>

                <input
                  id={`email-${index}`}
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="border p-2 rounded-md w-full mt-1"
                  placeholder="example@email.com"
                  aria-required="true"
                  aria-invalid={email.trim() === ""}
                />
              </div>

              {emails.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveEmail(index)}
                  aria-label={`Remove email field number ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          ))}
        </fieldset>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddEmail}
          className="flex items-center gap-2"
          disabled={emails.length >= 4}
          aria-disabled={emails.length >= 4}
          aria-describedby="email-limit-note"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Another Email
        </Button>

        {emails.length >= 4 && (
          <p
            id="email-limit-note"
            className="text-xs text-red-500"
            role="alert"
          >
            You can only add up to 4 parent/guardian emails.
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || emails.every((e) => e.trim().length === 0)}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" aria-hidden="true" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditParentEmail;
