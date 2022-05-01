import { hsl } from 'd3';
import { interpolateSpectral, scaleSequential, scaleLinear } from 'd3';

function getHSL(val) {
  return hsl(360 * val, 0.85, 0.7);
}

export function createColorGenerator(min_value, max_value, color) {
  let colorGenerator;
  switch (color) {
    case 'spectral':
      colorGenerator = scaleSequential()
        .domain([min_value, max_value])
        .interpolator(interpolateSpectral);
      break;
    case 'hsl':
      colorGenerator = scaleSequential()
        .domain([min_value, max_value])
        .interpolator(getHSL);
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

// Create 'summary' dictionary: Record<string, {name: string; value: number}>
function createSummaryDictionary(summariesOrDetails) {
  return summariesOrDetails.reduce((acc, curr) => {
    if (acc[curr.name] === undefined) {
      acc[curr.name] = {
        name: curr.name,
        value: curr.value,
      };
    } else {
      acc[curr.name].value += curr.value;
    }
    return acc;
  }, {});
}

// Sort summary dictionary
function sortSummaryDictionary(summaryDictionary) {
  return Object.values(summaryDictionary).sort((a, b) => {
    return b.value - a.value;
  });
}

// Calculate daily summary if that was not provided
export function addSummary(data) {
  if (Array.isArray(data)) {
    if (data[0].summary === null || data[0].summary === undefined) {
      data.forEach((d) => {
        // Create project dictionary: Record<string, {name: string; value: number}>
        const summaryDictionary = createSummaryDictionary(d.details);
        // Update "summary" property of the array element
        const summary = sortSummaryDictionary(summaryDictionary);
        d.summary = summary;
      });
    }
  }
}

export function getYearSummary(data, date) {
  let summaries = [];
  /**
   * Filtering the 'data' based on the year of date,
   * extracting all the summaries from the data into a single dimensional array and
   */
  if (Array.isArray(data)) {
    const summaryArray = data
      .filter(
        (e) => new Date(e.date).getFullYear() === new Date(date).getFullYear()
      )
      .flatMap((e) => e.summary);
    const summaryDictionary = createSummaryDictionary(summaryArray);
    summaries = sortSummaryDictionary(summaryDictionary);
  }
  return summaries;
}
