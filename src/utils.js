import { interpolateSpectral, scaleSequential, scaleLinear } from 'd3';

// Create spectral color generator function
export function generateSpectralInterpolate(min_value, max_value) {
  return scaleSequential()
    .domain([min_value, max_value])
    .interpolator(interpolateSpectral);
}

// Create linear color generator function
export function generateLinearColor(min_value, max_value, color) {
  return scaleLinear().range(['#ffffff', color]).domain([min_value, max_value]);
}
