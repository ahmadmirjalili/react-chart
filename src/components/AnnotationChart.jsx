import { LinePath } from "@visx/shape";

import ExampleControls from "./ExampleControls";

export const orange = "#ff7e67";
export const greens = ["#ecf4f3", "#68b0ab", "#006a71"];
const AnnotationChart = ({ width = 830, height = 480, compact = false }) => {
  return (
    <ExampleControls width={width} height={height} compact={compact}>
      {({ data, getDate, getStockValue, xScale, yScale }) => (
        <svg width={width} height={height}>
          <rect width={width} height={height} fill={greens[0]} />
          <LinePath
            stroke={greens[2]}
            strokeWidth={2}
            data={data}
            x={(d) => xScale(getDate(d)) ?? 0}
            y={(d) => yScale(getStockValue(d)) ?? 0}
          />
        </svg>
      )}
    </ExampleControls>
  );
};
export default AnnotationChart;
