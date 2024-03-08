import { InteractionData } from "./Heatmap";
import styles from "./tooltip.module.css";

type TooltipProps = {
  interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        width: "50px",
        height: "50px",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {/* The actual box with white background */}
      <div
        className={styles.tooltip}
        style={{
          position: "absolute",
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <span>{interactionData.xLabel}</span>
        <br />
        <span>{interactionData.yLabel}</span>
        <br />
        <span>Value: </span>
        <b>{interactionData.value}</b>
      </div>
    </div>
  );
};
