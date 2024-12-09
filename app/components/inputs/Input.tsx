import React from "react";

interface InputProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string; // 유연성을 위해 유지
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  label,
  onClick,
  disabled = false,
  required = false,
  type = "text",
  value,
  onChange,
}: InputProps) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        required={required}
        className={`peer w-full px-4 pt-5 pb-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          disabled ? "bg-gray-100" : "bg-white"
        }`}
      />
      <label
        className={`absolute left-3 top-2 text-gray-500 text-sm transition-all transform scale-100 origin-[0] peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-blue-500 ${
          disabled ? "text-gray-400" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
