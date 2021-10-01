import React, { FC } from "react";

interface DropdownSelectProps {
  options: { value: string; label: string }[];
}

export const DropdownSelect: FC<DropdownSelectProps> = ({ options }) => {
  return (
    <>
      <div>Dropdown x axis</div>
      <select>
        {options.map((opt) => {
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <div>Dropdown y axis</div>
      <select>
        {options.map((opt) => {
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </>
  );
};
