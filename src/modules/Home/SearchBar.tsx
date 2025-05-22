// components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFocus,
  readOnly = false,
  placeholder = "What do you wanna Watch?",
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <input
        type="text"
        autoFocus={!readOnly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full py-3 pl-10 pr-4 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
      />
      <svg
        className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
