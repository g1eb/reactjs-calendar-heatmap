import {
  interpolateSpectral,
  scaleSequential,
  scaleLinear,
  timeDays,
  range,
} from 'd3';

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

const generateDate = (dateElement) => {
  const projectDate = new Date(dateElement.getTime());
  projectDate.setHours(Math.floor(Math.random() * 24));
  projectDate.setMinutes(Math.floor(Math.random() * 60));
  return projectDate;
};

export function generateStorySampleData(yearsAgo) {
  const now = new Date();
  const timeAgo = new Date();
  timeAgo.setFullYear(timeAgo.getFullYear() - yearsAgo); // 'yearsAgo' years ago from now.
  timeAgo.setMonth(0); // Setting month to January.
  timeAgo.setDate(1); // Setting date to first of the given month.
  const data = timeDays(timeAgo, now).map((dateElement, index) => {
    const date = dateElement.toISOString();
    const maxRange = Math.floor(Math.random() * 10); // Generate random integer 0 to 9.
    const details = range(maxRange).map((_e, i, arr) => {
      return {
        name: 'Project ' + Math.ceil(Math.random() * 10),
        date: generateDate(dateElement).toISOString(),
        value:
          3600 * ((arr.length - i) / 5) +
          Math.floor(Math.random() * 3600) *
            Math.round(Math.random() * (index / 365)),
      };
    });
    const total = details.reduce((acc, e) => {
      return acc + e.value;
    }, 0);

    return {
      date,
      details,
      total,
    };
  });
  return data;
}
