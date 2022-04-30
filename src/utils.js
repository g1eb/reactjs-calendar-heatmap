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

export function getYearSummary(data, date) {
  /**
   * Filtering the 'data' based on the year of date,
   * extracting all the summaries from the data into a single dimensional array and
   * create 'summary' dictionary: Record<string, {name: string; value: number}>
   */
  const summaryDictionary = data
    .filter(
      (e) => new Date(e.date).getFullYear() === new Date(date).getFullYear()
    )
    .flatMap((e) => e.summary)
    .reduce((summary, item) => {
      if (summary[item.name] === undefined) {
        summary[item.name] = {
          name: item.name,
          value: item.value,
        };
      } else {
        summary[item.name].value += item.value;
      }
      return summary;
    }, {});
  return Object.values(summaryDictionary).sort((a, b) => {
    return b.value - a.value;
  });
}

// Calculate daily summary if that was not provided
export function parseData(data) {
  if (Array.isArray(data)) {
    if (data[0].summary === null || data[0].summary === undefined) {
      data.forEach((d) => {
        // Create project dictionary: Record<string, {name: string; value: number}>
        let summaryDictionary = d.details.reduce((uniques, project) => {
          if (uniques[project.name] === undefined) {
            uniques[project.name] = {
              name: project.name,
              value: project.value,
            };
          } else {
            uniques[project.name].value += project.value;
          }
          return uniques;
        }, {});
        // Update "summary" property of the array element
        d.summary = Object.values(summaryDictionary).sort((a, b) => {
          return b.value - a.value;
        });
      });
    }
  }
}
