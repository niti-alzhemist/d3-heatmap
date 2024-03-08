import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { MARGIN } from "./constants";
import { InteractionData } from "./Heatmap.tsx";

type RendererProps = {
  width: number;
  height: number;
  data: d3.DSVRowArray;
  onSetInteractionData: (d: InteractionData | null) => void;
};

export const Renderer = ({ width, height, data }: RendererProps) => {
  // const [brushCell, setBrushCell] = useState();
  const svgGRef = useRef<any>(null);
  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xSets = Array.from(new Set(data.map((d) => d.x)));
  const ySets = Array.from(new Set(data.map((d) => d.y)));

  const x = useMemo(() => {
    return d3.scaleBand().range([0, boundsWidth]).domain(xSets).padding(0.1);
  }, [boundsWidth, xSets]);

  const y = useMemo(() => {
    return d3
      .scaleBand<string>()
      .range([boundsHeight, 0])
      .domain(ySets)
      .padding(0.1);
  }, [boundsHeight, ySets]);

  const heatmapColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1, 100]);

  const allRects = useMemo(() => {
    return data.map((d, i) => {
      const xPos = x(String(d.x));
      const yPos = y(d.y);

      if (d.value === null || !xPos || !yPos) {
        return;
      }
      return (
        <rect
          key={i}
          x={xPos}
          y={yPos}
          width={x.bandwidth()}
          height={y.bandwidth()}
          fill={d.value ? heatmapColor(+d.value) : "#F8F8F8"}

          // Tooltip mouse actions
          // onMouseEnter={() => {
          //     onSetInteractionData({
          //         xPos,
          //         yPos,
          //         yLabel: `y: ${yPos}`,
          //         xLabel: `x: ${xPos}`,
          //         value: +d!.value,
          //     });
          // }}
          // onMouseLeave={() => {
          //     onSetInteractionData(null);
          // }}
        />
      );
    });
  }, []);

  useEffect(() => {
    const group = d3.select(svgGRef.current);
    const allRect = d3.selectAll("rect");
    console.log("=>.", allRect.data());

    group.call(
      d3.brush().on("start brush end", ({ selection }) => {
        const value = [];
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;

          // value = allRect
          //   .style("stroke", "gray")
          //   .filter((d) => {
          //     return;
          //     x0 <= x(d["type"]) &&
          //       x(d["type"]) < x1 &&
          //       y0 <= y(d["type"]) &&
          //       y(d["type"]) < y1;
          //   })
          //   .style("stroke", "steelblue")
          //   .data();
        } else {
          // allRect.style("stroke", "steelblue");
        }

        // Inform downstream cells that the selection has changed.
        // group.property("value", value).dispatch("input");
      }),
    );
  }, [allRects, x, y]);

  return (
    <svg
      id={"mysvg"}
      className="elements selecto-area"
      width={width}
      height={height}
    >
      <g
        ref={svgGRef}
        id={"mysvgg"}
        className="brush"
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
      </g>
    </svg>
  );
};
