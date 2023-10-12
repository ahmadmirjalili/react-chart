import { bisector } from "@visx/vendor/d3-array";

export default function findNearestDatum({ value, scale, accessor, data }) {
  const bisect = bisector(accessor).left;
  const nearestValue = scale.invert(value);
  const nearestValueIndex = bisect(data, nearestValue, 1);
  const d0 = data[nearestValueIndex - 1];
  const d1 = data[nearestValueIndex];
  let nearestDatum = d0;
  if (d1 && accessor(d1)) {
    nearestDatum =
      nearestValue - accessor(d0) > accessor(d1) - nearestValue ? d1 : d0;
  }
  return nearestDatum;
}
