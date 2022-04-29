import { interpolateSpectral, scaleSequential, scaleLinear } from 'd3';

export function createColorGenerator(min_value, max_value, color) {
  let colorGenerator;
  let colorCode = color;
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const hexResult = hexRegex.test(colorCode);
  if (colorCode !== 'spectral' && hexResult === false) {
    colorCode = '#ff4500';
  }
  switch (colorCode) {
    case 'spectral':
      colorGenerator = scaleSequential()
        .domain([min_value, max_value])
        .interpolator(interpolateSpectral);
      break;
    default:
      colorGenerator = scaleLinear()
        .range(['#ffffff', colorCode])
        .domain([min_value, max_value]);
  }
  return colorGenerator;
}
