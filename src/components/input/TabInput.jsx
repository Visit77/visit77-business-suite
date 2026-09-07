import React, { useState } from "react";
import { Tag, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const TagInput = ({ value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
        setInputValue("");
      }
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white focus-within:border-blue-500 transition-colors">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm font-medium text-gray-700"
          >
            {tag}
            <CloseOutlined
              className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={() => handleRemove(tag)}
            />
          </span>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        bordered={false}
        className="p-0 text-sm placeholder-gray-400 focus:ring-0"
      />
    </div>
  );
};

export default TagInput;
