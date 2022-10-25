import { faker } from '@faker-js/faker';
import { timeDays, timeMinutes } from 'd3';
import {
  endOfDay,
  startOfDay,
  startOfYear,
  subYears,
  endOfYear,
} from 'date-fns';
import type { CalendarHeatmapDatum } from './utils';

faker.mersenne.seed(1);

// Modified it to simulate 'bin-data' rest api.
export function generateStorySampleDataForHeatmap(
  yearsAgo: number,
  binsPerHour: number // Shouldn't be greater than 60
): CalendarHeatmapDatum[] {
  const lastDate = endOfYear(new Date());
  let firstDate = subYears(new Date(), yearsAgo); // Returns new date by substracting 'yearsAgo' number of years. Ref: https://date-fns.org/v2.28.0/docs/subYears
  firstDate = startOfYear(firstDate);
  const binStep = 60 / binsPerHour;
  const data: CalendarHeatmapDatum[] = timeDays(firstDate, lastDate).map(
    (dateElement) => {
      const start = startOfDay(dateElement);
      const end = endOfDay(dateElement);
      const details = timeMinutes(start, end, binStep).map((e) => ({
        date: e.toISOString(),
        value: faker.datatype.number({ min: 0, max: 100 }), // Generate value from 0-100
      }));

      const total = details.reduce((acc, e) => acc + e.value, 0);

      return {
        date: start.toISOString(),
        details,
        total,
      };
    }
  );

  return data;
}
