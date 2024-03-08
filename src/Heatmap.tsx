import { Renderer } from "./Renderer";
import { COLOR_LEGEND_HEIGHT } from "./constants";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import { Tooltip } from "./Tooltip.tsx";

type HeatmapProps = {
  width: number;
  height: number;
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number | null;
};

export const Heatmap = ({ width, height }: HeatmapProps) => {
  const [data, setData] = useState<d3.DSVRowArray>();
  const [interactionData, setInteractiondata] =
    useState<InteractionData | null>(null);

  const handleOnSetInteractionData = (d: InteractionData | null) => {
    setInteractiondata(d);
  };

  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/niti-alzhemist/40x1000/main/sample_dataset.csv",
    ).then((value) => {
      setData(value);
    });
  }, []);

  if (!data) {
    return <div>Loading data</div>;
  }
  return (
    <div style={{ position: "relative" }}>
      <Renderer
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
        data={data}
        onSetInteractionData={handleOnSetInteractionData}
      />
      <Tooltip interactionData={interactionData} />
    </div>
  );
};
