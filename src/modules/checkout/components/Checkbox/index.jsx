import React from "react";

export function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <div
        className={`w-5 h-5 flex items-center justify-center rounded border ${
          checked ? "bg-blue-600 border-blue-600" : "border-gray-400"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
