import * as d3 from "d3";
import React, { RefObject } from "react";
import data from "../data/data.json";
import { DropdownSelect } from "./dropwdown-select";
interface ScatterChartProps {}
interface State {
  xAxisKey: string;
  yAxisKey: string;
}
class ScatterChart extends React.Component<ScatterChartProps, State> {
  myRef: RefObject<HTMLDivElement>;
  tagsData: any[];
  numericKeys: string[];

  constructor(props: ScatterChartProps) {
    super(props);
    this.myRef = React.createRef();
    this.tagsData = getTagsData();
    this.numericKeys = getNumericKeys(this.tagsData[0]);
    this.state = {
      xAxisKey: this.numericKeys[0],
      yAxisKey: this.numericKeys[1],
    };
    this.handleXAxisChange = this.handleXAxisChange.bind(this);
    this.handleYAxisChange = this.handleYAxisChange.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
  }

  componentDidMount() {
    this.renderGraph();
  }

  renderGraph() {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    d3.selectAll("svg").remove();
    const svg = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxisKey = this.state.xAxisKey;
    const yAxisKey = this.state.yAxisKey;

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain([0, getMaxValue(this.tagsData, xAxisKey)])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, getMaxValue(this.tagsData, yAxisKey)])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(this.tagsData)
      .join("circle")
      .attr("cx", function (d: any) {
        return x(d[xAxisKey]);
      })
      .attr("cy", function (d: any) {
        return y(d[yAxisKey]);
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2");
  }

  handleXAxisChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      xAxisKey: event.target.value,
    });
  }

  handleYAxisChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      yAxisKey: event.target.value,
    });
  }

  render() {
    this.renderGraph();

    return (
      <>
        <h1>ScatterChart</h1>
        <DropdownSelect
          xAxisValue={this.state.xAxisKey}
          yAxisValue={this.state.yAxisKey}
          options={getNumericOptions(this.numericKeys)}
          handleXAxisChange={this.handleXAxisChange}
          handleYAxisChange={this.handleYAxisChange}
        />
        <div ref={this.myRef}></div>
      </>
    );
  }
}
export default ScatterChart;

function getTagsData() {
  return Object.keys(data).map((id) => {
    const parsedObj = JSON.parse((data as any)[id].tags);
    return { id, ...parsedObj["igx-profile"], ...parsedObj["airr"] };
  });
}

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
  return keys.map((key) => {
    return { value: key, label: key };
  });
}

function getMaxValue(tags: any[], key: string) {
  return tags.reduce(
    (prev, current) => (prev > current[key] ? prev : current[key]),
    0
  );
}
