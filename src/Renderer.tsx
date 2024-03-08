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
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .on("start brush end", brushHandler);

    group.call(brush);

    function brushHandler({ selection }) {
      const value = [];
      if (selection) {
        const [[x0, y0], [x1, y1]] = selection;

        const selectedData = data.filter(
          (d) =>
            x0 <= x(String(d.x))! &&
            x(String(d.x))! < x1 &&
            y0 <= y(d.y)! &&
            y(d.y)! < y1,
        );
        // console.log("=>>> selected Data", selectedData);

        // onSetInteractionData({ selection: selectedData, bounds: selection });
      } else {
        // console.log("=>>> selected Data null");
        // onSetInteractionData(null);
      }
    }

    return () => {
      group.on(".brush", null); // Remove the brush listener when component unmounts
    };
  }, [data, boundsWidth, boundsHeight, x, y]);
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
