import * as d3 from "d3";
import React, { RefObject } from "react";
import data from "../../data/data.json";
import { DropdownSelect } from "../dropdown-select/dropdown-select";
import { TableComponent } from "../table/table";
import "./scatterplot-chart.css";

interface ScatterChartProps { }
interface State {
  xAxisKey: string;
  yAxisKey: string;
  selectedIds: number[];
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
      selectedIds: [],
    };
    this.handleXAxisChange = this.handleXAxisChange.bind(this);
    this.handleYAxisChange = this.handleYAxisChange.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
  }

  componentDidMount() {
    this.renderGraph();
  }

  renderGraph() {
    const margin = { top: 10, right: 30, bottom: 60, left: 80 },
      width = 480 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    d3.selectAll("svg").remove();
    const svg = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "transparent");

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
    svg
      .append("text")
      .attr("text-anchor", "end")
      .style("fill", "white")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text(xAxisKey);

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, getMaxValue(this.tagsData, yAxisKey)])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    svg
      .append("text")
      .attr("text-anchor", "end")
      .style("fill", "white")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top)
      .text(yAxisKey);

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(this.tagsData)
      .join("circle")
      .attr("data-id", function (d: any) {
        return d.id;
      })
      .attr("cx", function (d: any) {
        return x(d[xAxisKey]);
      })
      .attr("cy", function (d: any) {
        return y(d[yAxisKey]);
      })
      .attr("r", 1.5)
      .attr("class", (d: any) => {
        return this.state.selectedIds.includes(d.id) ? "selected" : "";
      });

    // Rectangular select
    svg
      .on("mousedown", function (e) {
        d3.selectAll("circle.selected").classed("selected", false);
        svg
          .append("rect")
          .attr("x", e.layerX - margin.left)
          .attr("y", e.layerY - margin.top)
          .attr("width", 0)
          .attr("height", 0)
          .attr("class", "selection");
      })

      .on("mouseup", (e) => {
        const selectedIds: number[] = [];
        d3.selectAll("circle.selected").each((state_data: any) => {
          selectedIds.push(state_data.id);
        });
        this.setState({
          selectedIds,
        });
      })

      // .on("mouseout", function (e) {
      //   console.log("mouseout", e);
      //   if (e.relatedTarget !== "svg") {
      //     svg.selectAll("rect.selection").remove();
      //     d3.selectAll("g.state.selection").classed("selection", false);
      //   }
      // })

      .on("mousemove", function (e) {
        let s = svg.select("rect.selection");
        if (!s.empty()) {
          let d = {
            x: parseInt(s.attr("x"), 10),
            y: parseInt(s.attr("y"), 10),
            width: parseInt(s.attr("width"), 10),
            height: parseInt(s.attr("height"), 10),
          };
          let move = {
            x: e.layerX - margin.left - d.x,
            y: e.layerY - margin.top - d.y,
          };
          if (move.x < 1 || move.x * 2 < d.width) {
            d.x = e.layerX - margin.left;
            d.width -= move.x;
          } else {
            d.width = move.x;
          }
          if (move.y < 1 || move.y * 2 < d.height) {
            d.y = e.layerY - margin.top;
            d.height -= move.y;
          } else {
            d.height = move.y;
          }

          s.attr("x", d.x)
            .attr("y", d.y)
            .attr("width", d.width)
            .attr("height", d.height);

          d3.selectAll("g > circle.selected").classed("selected", false);
          d3.selectAll("g > circle").each(function () {
            if (
              !d3.select(this).classed("selected") &&
              parseInt(d3.select(this).attr("cx")) >= d.x &&
              parseInt(d3.select(this).attr("cx")) <= d.x + d.width &&
              parseInt(d3.select(this).attr("cy")) >= d.y &&
              parseInt(d3.select(this).attr("cy")) <= d.y + d.height
            ) {
              d3.select(this).attr("class", "selected");
            }
          });
        }
      });
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
    let selectedTags = this.tagsData.filter((obj) => {
      return this.state.selectedIds.includes(obj.id);
    });

    return (
      <>
        <h1>ScatterPlot Chart</h1>
        <div className="wrapper">
          <DropdownSelect
            xAxisValue={this.state.xAxisKey}
            yAxisValue={this.state.yAxisKey}
            options={getNumericOptions(this.numericKeys)}
            handleXAxisChange={this.handleXAxisChange}
            handleYAxisChange={this.handleYAxisChange}
          />
          <div ref={this.myRef}></div>
        </div>
        <h4>
          You selected {selectedTags.length}{" "}
          {selectedTags.length !== 1 ? "sequences" : "sequence"}
        </h4>
				<TableComponent data={selectedTags}/>
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
