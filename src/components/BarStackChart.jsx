import { BarStack } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom, AxisRight } from "@visx/axis";
import cityTemperature from "@visx/mock-data/lib/mocks/cityTemperature";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeParse, timeFormat } from "@visx/vendor/d3-time-format";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { LegendOrdinal } from "@visx/legend";

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
export const purple3 = "#a44afe";
export const background = "#eaedff";
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

const data = cityTemperature.slice(0, 12);
const data2 = ["100%", "50%", "20%"];
const keys = Object.keys(data[0]).filter((d) => d !== "date");
const temperatureTotals = data.reduce((allTotals, currentDate) => {
  const totalTemperature = keys.reduce((dailyTotal, k) => {
    dailyTotal += Number(currentDate[k]);
    return dailyTotal;
  }, 0);
  allTotals.push(totalTemperature);
  return allTotals;
}, []);

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date) => {
  return format(parseDate(date));
};

// accessors
const getDate = (d) => d.date;

// scales
const dateScale = scaleBand({
  domain: data.map(getDate),
  padding: 0.2,
});
const dateScale1 = scaleBand({
  domain: data2,
  padding: -0.57,
});
const temperatureScale = scaleLinear({
  domain: [0, Math.max(...temperatureTotals)],
  nice: true,
});
const colorScale = scaleOrdinal({
  domain: keys,
  range: [purple1, purple2, purple3],
});

let tooltipTimeout;

const BarStackChart = ({
  width = 830,
  height = 480,
  events = false,
  margin = defaultMargin,
}) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  });

  if (width < 10) return null;
  // bounds
  const xMax = width - 50;
  const yMax = height - margin.top - 100;
  dateScale.rangeRound([0, xMax]);
  dateScale1.rangeRound([0, yMax]);
  temperatureScale.range([yMax, 0]);

  return width < 10 ? null : (
    <>
      <div style={{ position: "relative" }}>
        <svg ref={containerRef} width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={background}
            rx={14}
          />
          <Grid
            top={margin.top}
            left={margin.left}
            xScale={dateScale}
            yScale={temperatureScale}
            width={xMax}
            height={yMax}
            stroke="black"
            strokeOpacity={0.1}
            xOffset={dateScale.bandwidth() / 2}
          />
          <Group top={margin.top}>
            <BarStack
              data={data}
              keys={keys}
              x={getDate}
              xScale={dateScale}
              yScale={temperatureScale}
              color={colorScale}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <>
                      <rect
                        key={`bar-stack-${barStack.index}-${bar.index}`}
                        x={bar.x}
                        y={bar.y}
                        height={bar.height}
                        width={bar.width}
                        fill={bar.color}
                        onClick={() => {
                          if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                        }}
                        onMouseLeave={() => {
                          tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 300);
                        }}
                        onMouseMove={(event) => {
                          if (tooltipTimeout) clearTimeout(tooltipTimeout);
                          // TooltipInPortal expects coordinates to be relative to containerRef
                          // localPoint returns coordinates relative to the nearest SVG, which
                          // is what containerRef is set to in this example.
                          const eventSvgCoords = localPoint(event);
                          const left = bar.x + bar.width / 2;
                          showTooltip({
                            tooltipData: bar,
                            tooltipTop: eventSvgCoords?.y,
                            tooltipLeft: left,
                          });
                        }}
                      />
                    </>
                  ))
                )
              }
            </BarStack>
          </Group>
          <AxisBottom
            top={yMax + margin.top}
            scale={dateScale}
            tickFormat={(w) => {
              const a = formatDate(w);
              //   console.log("a", a);
              return a;
            }}
            stroke={purple3}
            tickStroke={purple3}
            tickLabelProps={{
              fill: purple3,
              fontSize: 11,
              textAnchor: "middle",
            }}
          />
          <AxisRight
            top={margin.top}
            left={780}
            scale={dateScale1}
            tickFormat={(e) => {
              return e;
            }}
            stroke={purple3}
            tickStroke={purple3}
            tickLabelProps={{
              fill: purple3,
              fontSize: 11,

              textAnchor: "start",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: margin.top / 2 - 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          <LegendOrdinal
            scale={colorScale}
            direction="row"
            labelMargin="0 15px 0 0"
          />
        </div>

        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <div style={{ color: colorScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
            <div>
              <small>{formatDate(getDate(tooltipData.bar.data))}</small>
            </div>
          </TooltipInPortal>
        )}
      </div>
    </>
  );
};

export default BarStackChart;
