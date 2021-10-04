import React, { ChangeEventHandler, FC } from "react";
import "./dropdown-select.css";

interface DropdownSelectProps {
  options: { value: string; label: string }[];
  handleXAxisChange: ChangeEventHandler<HTMLSelectElement>;
  handleYAxisChange: ChangeEventHandler<HTMLSelectElement>;
  xAxisValue: string;
  yAxisValue: string;
}

export const DropdownSelect: FC<DropdownSelectProps> = ({
  options,
  handleXAxisChange,
  handleYAxisChange,
  xAxisValue,
  yAxisValue,
}) => {
  return (
    <div className="container">
      <div>
        <h5>Dropdown X Axis</h5>
        <select id="xAxis" onChange={handleXAxisChange} value={xAxisValue}>
          {options.map((opt) => {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <h5>Dropdown Y Axis</h5>
        <select id="yAxis" onChange={handleYAxisChange} value={yAxisValue}>
          {options.map((opt) => {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
