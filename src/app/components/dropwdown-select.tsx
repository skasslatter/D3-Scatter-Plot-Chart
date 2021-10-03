import React, { ChangeEventHandler, FC } from "react";

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
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <div>
        <h5>Dropdown x axis</h5>
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
        <h5>Dropdown y axis</h5>
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
