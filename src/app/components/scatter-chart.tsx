import * as d3 from "d3";
import React, { RefObject } from "react";
import data from "../data/data.json";
import { DropdownSelect } from "./dropwdown-select";
interface ScatterChartProps {}

class ScatterChart extends React.Component<ScatterChartProps> {
  myRef: RefObject<HTMLDivElement>;
  data: any;
  tagsData: any[];
  maxValueXAxis: number = 0;
  maxValueYAxis: number = 0;
  numericKeys: string[];

  constructor(props: ScatterChartProps) {
    super(props);
    this.myRef = React.createRef();
    this.data = data;

    this.tagsData = Object.keys(data).map((key) => {
      const parsedObj = JSON.parse(this.data[key].tags);
      return { ...parsedObj["igx-profile"], ...parsedObj["airr"] };
    });
    this.numericKeys = getNumericKeys(this.tagsData[0]);
    this.maxValueXAxis = getMaxValue(this.tagsData, "J Score");
    this.maxValueYAxis = getMaxValue(this.tagsData, "Read Count");
  }

  componentDidMount() {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain([0, this.maxValueXAxis])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, this.maxValueYAxis])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(this.tagsData)
      .join("circle")
      .attr("cx", function (d: any) {
        return x(d["J Score"]);
      })
      .attr("cy", function (d: any) {
        return y(d["Read Count"]);
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2");
  }

  render() {
    return (
      <>
        <p>ScatterChart</p>
        <DropdownSelect options={getNumericOptions(this.numericKeys)} />
        <div ref={this.myRef}></div>
      </>
    );
  }
}
export default ScatterChart;

function getNumericKeys(object: any): string[] {
  const numericKeys = [];
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === "number") {
      numericKeys.push(key);
    }
  }
  return numericKeys;
}

function getNumericOptions(keys: string[]): { value: string; label: string }[] {
  const numericOptions = keys.map((key) => {
    return { value: key, label: key };
  });
  return numericOptions;
}

function getMaxValue(tags: any[], key: string) {
  const max = tags.reduce(
    (prev, current) => (prev > current[key] ? prev : current[key]),
    0
  );
  return max;
}
