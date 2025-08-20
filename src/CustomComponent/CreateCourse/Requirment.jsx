import React, { useState } from "react";

const RequirementInput = React.memo(
  ({ field, index, remove, error, register, requirementsFields }) => {
    // State to track the input value length
    const [inputValue, setInputValue] = useState(field.value || "");

    // Handle change to update input value length
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const remainingChars = 120 - inputValue.length; // Calculate remaining characters

    return (
      <div key={field.id} className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-2 gap-2 w-[100%]">
          <input
            {...register(`requirements.${index}.value`)}
            placeholder="What is your course requirement..."
            maxLength={120}
            value={inputValue}
            onChange={handleInputChange} // Handle input change
            className={`pr-16 bg-gray-50 w-full relative border border-gray-300 rounded-sm px-3 py-1 ${
              error ? "border border-red-500" : ""
            }`}
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className={`text-red-500 cursor-pointer border border-gray-300 px-2 py-1 rounded-lg ${
              requirementsFields.length === 1 ? "hidden" : ""
            }`}
          >
            Remove
          </button>
        </div>

        {/* Show remaining characters */}
        <div className="text-xs text-gray-500 mt-1">
          {remainingChars} characters remaining
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  }
);

export default RequirementInput;