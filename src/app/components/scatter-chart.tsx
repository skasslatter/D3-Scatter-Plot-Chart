import * as d3 from "d3";
import React, { RefObject } from "react";
import data from "../data/data.json";
import { DropdownSelect } from "./dropwdown-select";
interface ScatterChartProps {}

class ScatterChart extends React.Component<ScatterChartProps> {
  myRef: RefObject<HTMLDivElement>;
  data: any;
  numericOptions: { value: string; label: string }[];
  tags: any[];
  maxValueXAxis: number = 0;
  maxValueYAxis: number = 0;

  constructor(props: ScatterChartProps) {
    super(props);
    this.myRef = React.createRef();
    this.data = data;

    const keys = Object.keys(data);
    this.tags = keys.map((key) => {
      return JSON.parse(this.data[key].tags);
    });

    // {
    //   ...obj[key1],
    //   ...obj[key2],
    // }

    const firstObject = JSON.parse(this.data[keys[0]].tags);
    const nestedKeys = Object.keys(firstObject);
    const numericKeys = [
      ...getNumericKeys(firstObject[nestedKeys[0]]),
      ...getNumericKeys(firstObject[nestedKeys[1]]),
    ];
    this.numericOptions = getNumericOptions(numericKeys);

    this.maxValueXAxis = getMaxValue(this.tags, ["igx-profile", "J Score"]);
    this.maxValueYAxis = getMaxValue(this.tags, ["airr", "Read Count"]);
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
      .data(this.tags)
      .join("circle")
      .attr("cx", function (d: any) {
        return x(d["igx-profile"]["J Score"]);
      })
      .attr("cy", function (d: any) {
        return y(d["airr"]["Read Count"]);
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2");
  }

  render() {
    return (
      <>
        <p>ScatterChart</p>
        <DropdownSelect options={this.numericOptions} />
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

function getMaxValue(tags: any[], keys: Array<string>) {
  const max = tags.reduce(
    (prev, current) =>
      prev > current[keys[0]][keys[1]] ? prev : current[keys[0]][keys[1]],
    0
  );
  return max;
}
