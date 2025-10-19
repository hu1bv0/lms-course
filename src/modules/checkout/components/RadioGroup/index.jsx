import React from "react";

export function RadioGroup({ value, onChange, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { selectedValue: value, onChange })
      )}
    </div>
  );
}

export function RadioGroupItem({ value, label, selectedValue, onChange }) {
  const checked = selectedValue === value;

  return (
    <label
      className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2 ${
        checked ? "border-blue-600 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="hidden"
      />
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
          checked ? "border-blue-600" : "border-gray-400"
        }`}
      >
        {checked && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
}
