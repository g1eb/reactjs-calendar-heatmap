import { interpolateSpectral, scaleSequential, scaleLinear } from 'd3';

export function createColorGenerator(min_value, max_value, color) {
  let colorGenerator;
  switch (color) {
    case 'spectral':
      colorGenerator = scaleSequential()
        .domain([min_value, max_value])
        .interpolator(interpolateSpectral);
      break;
    case null:
    case undefined:
      colorGenerator = scaleLinear()
        .range(['#ffffff', '#ff4500'])
        .domain([min_value, max_value]);
      break;
    default:
      colorGenerator = scaleLinear()
        .range(['#ffffff', color])
        .domain([min_value, max_value]);
  }
  return colorGenerator;
}
