import { maxIndex } from 'd3';
import { useCallback, useEffect, useState } from 'react';
import { DayOverviewHeatMap } from '../DayOverviewHeatmap';
import { GlobalOverviewHeatMap } from '../GlobalOverviewHeatmap';
import { MonthOverviewHeatMap } from '../MonthOverviewHeatmap';
import { fadeAwayElements } from '../utils';
import { YearOverviewHeatMap } from '../YearOverviewHeatmap';
import type { MonthOverviewDatum } from '../MonthOverviewHeatmap/utils';
import type { CalendarHeatmapDatum } from '../utils';
import type { YearOverviewDatum } from '../YearOverviewHeatmap/utils';
import type {
  DrilldownCalendarProps,
  DrilldownCalendarOverview,
} from './utils';

/**
 * @param data
 * @param year
 * @returns
 */
function filterDataByYear(
  data: CalendarHeatmapDatum[],
  year: number
): CalendarHeatmapDatum[] {
  return data.filter((ele) => new Date(ele.date).getFullYear() === year);
}

/**
 * Assumes data belongs to the selected year
 * @param data
 * @param month
 * @returns
 */
function filterMonthData(
  data: CalendarHeatmapDatum[],
  month: string
): CalendarHeatmapDatum[] {
  return data.filter(
    (ele) =>
      new Date(ele.date).toLocaleString(undefined, { month: 'short' }) === month
  );
}

/**
 * Assumes data belongs to the selcted year or month
 * @param data
 * @param datum
 * @returns
 */
function filterSelectedDatum(
  data: CalendarHeatmapDatum[],
  datum: YearOverviewDatum | MonthOverviewDatum
): CalendarHeatmapDatum {
  return (
    data.find((ele) => ele.date === datum.date.toISOString()) ?? {
      date: new Date().toISOString(),
      total: NaN,
    }
  );
}

interface BottomLabelProps {
  overview: DrilldownCalendarOverview;
  currentYearDate: Date;
  currentMonthDate: Date;
  currentDayDate: Date;
}

function getBottomLabel({
  overview,
  currentYearDate,
  currentMonthDate,
  currentDayDate,
}: BottomLabelProps): string {
  let label = '';
  switch (overview) {
    case 'day':
      label = currentDayDate.toLocaleString(undefined, { dateStyle: 'medium' });
      break;
    case 'month':
      label = `${currentMonthDate.toLocaleDateString(undefined, {
        month: 'short',
      })} ${currentMonthDate.getFullYear()}`;
      break;
    case 'year':
      label = currentYearDate.getFullYear().toString();
      break;
    default:
      break;
  }
  return label;
}

/**
 * @param param0
 * @returns
 */
export function DrilldownCalendar({
  data,
  overview,
  color,
  onTooltip,
  onHideTooltip,
  response,
  fetchGlobalData,
  fetchDayData,
  showDayXAxisLabels,
  ...rest
}: DrilldownCalendarProps): JSX.Element {
  const [overviewOrder, setOverviewOrder] = useState<
    DrilldownCalendarOverview[]
  >([overview ?? 'global']);
  const [globalData, setGlobalData] = useState<CalendarHeatmapDatum[]>([]);
  const [currentYearData, setCurrentYearData] = useState<
    CalendarHeatmapDatum[]
  >([]);
  const [currentMonthData, setCurrentMonthData] = useState<
    CalendarHeatmapDatum[]
  >([]);
  const [currentDay, setCurrentDay] = useState<CalendarHeatmapDatum>({
    date: new Date().toISOString(),
    total: NaN,
  });
  const [fade, setFade] = useState(false);

  // To fetch data.
  useEffect(() => {
    let fetchedData: CalendarHeatmapDatum[] = [];
    async function fetchData() {
      if (Array.isArray(data) === true && data?.length !== 0) {
        fetchedData = data ?? [];
      } else {
        fetchedData = (await fetchGlobalData?.()) ?? [];
      }
      setGlobalData(fetchedData); // Storing the final data in the 'globalData' state variable for further use.
    }
    fetchData().catch((err) => {
      throw err;
    });
  }, [data, fetchGlobalData]);

  // To set initial data for first rendering of an overview.
  useEffect(() => {
    if (globalData.length > 0) {
      const currentDatumIndex = maxIndex(
        globalData,
        (datum) => new Date(datum.date)
      );
      switch (overview) {
        case 'month':
          setCurrentMonthData(
            filterMonthData(
              globalData,
              new Date(globalData[currentDatumIndex].date).toLocaleString(
                undefined,
                {
                  month: 'short',
                }
              )
            )
          );
          break;
        case 'year':
          setCurrentYearData(
            filterDataByYear(
              globalData,
              new Date(globalData[currentDatumIndex].date).getFullYear()
            )
          );
          break;
        case 'day':
          setCurrentDay(globalData[currentDatumIndex]);
          break;
        default:
          break;
      }
    }
  }, [globalData, overview]);

  // To memoize the 'onFadeComplete' handler
  const onFadeComplete = useCallback(() => {
    setFade(false);
    setOverviewOrder((prev) => {
      const newOrder = [...prev];
      newOrder.pop();
      return newOrder;
    });
  }, [setFade, setOverviewOrder]);

  function getOverviewChart(input?: DrilldownCalendarOverview): JSX.Element {
    let output: JSX.Element;
    switch (input) {
      case 'year':
        output = (
          <YearOverviewHeatMap
            color={color}
            data={currentYearData}
            {...rest}
            response={response}
            fade={fade}
            onTooltip={onTooltip}
            onHideTooltip={onHideTooltip}
            onFadeComplete={onFadeComplete}
            onCellClick={(d) => {
              fadeAwayElements([
                '.heat-cell',
                '.x-axis',
                '.y-axis',
                '.month-boundary',
              ])
                .then(() => {
                  setCurrentDay(filterSelectedDatum(currentYearData, d));
                  setOverviewOrder((prev) => [
                    ...prev,
                    'day' as DrilldownCalendarOverview,
                  ]);
                })
                .catch((err) => {
                  throw err;
                });
            }}
            onMonthLabelClick={(d) => {
              fadeAwayElements([
                '.heat-cell',
                '.x-axis',
                '.y-axis',
                '.month-boundary',
              ])
                .then(() => {
                  setCurrentMonthData(filterMonthData(currentYearData, d));
                  setOverviewOrder((prev) => [
                    ...prev,
                    'month' as DrilldownCalendarOverview,
                  ]);
                })
                .catch((err) => {
                  throw err;
                });
            }}
          />
        );
        break;
      case 'month':
        output = (
          <MonthOverviewHeatMap
            color={color}
            data={currentMonthData}
            {...rest}
            response={response}
            fade={fade}
            onTooltip={onTooltip}
            onHideTooltip={onHideTooltip}
            onFadeComplete={onFadeComplete}
            onCellClick={(d) => {
              fadeAwayElements(['.heat-cell', '.x-axis', '.y-axis'])
                .then(() => {
                  setCurrentDay(filterSelectedDatum(currentMonthData, d));
                  setOverviewOrder((prev) => [
                    ...prev,
                    'day' as DrilldownCalendarOverview,
                  ]);
                })
                .catch((err) => {
                  throw err;
                });
            }}
          />
        );
        break;
      case 'day':
        output = (
          <DayOverviewHeatMap
            color={color}
            data={currentDay}
            {...rest}
            showXAxisLabels={showDayXAxisLabels}
            fetchDayData={fetchDayData}
            response={response}
            fade={fade}
            onTooltip={onTooltip}
            onHideTooltip={onHideTooltip}
            onFadeComplete={onFadeComplete}
          />
        );
        break;
      case 'global':
      default:
        output = (
          <GlobalOverviewHeatMap
            color={color}
            data={globalData}
            {...rest}
            response={response}
            fade={fade}
            onTooltip={onTooltip}
            onHideTooltip={onHideTooltip}
            onFadeComplete={onFadeComplete}
            onCellClick={(d) => {
              fadeAwayElements(['.heat-cell', '.x-axis'])
                .then(() => {
                  const { year } = d;
                  setCurrentYearData(filterDataByYear(globalData, year));
                  setOverviewOrder((prev) => [
                    ...prev,
                    'year' as DrilldownCalendarOverview,
                  ]);
                })
                .catch((err) => {
                  throw err;
                });
            }}
          />
        );
        break;
    }
    return output;
  }

  return (
    <div style={{ position: 'relative' }} className={rest.className}>
      <button
        type="button"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'transparent',
          borderColor: 'transparent',
          /**
           * When wrapping this whole component , it might happen the component and
           * its child components would be in different z level than the wrapping component.
           * Increasing the zIndex so that the back button is accessible to the user input devices.
           */
          zIndex: 5,
        }}
        disabled={overviewOrder[overviewOrder.length - 1] === 'global'}
        onClick={() => {
          setFade(true);
        }}
      >
        {/* Adopted from mui icons */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          className={rest.className}
        >
          <path d="M0 0h24v24H0z" fill="transparent" />
          <path
            d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"
            fill="var(--primary_color)"
          />
        </svg>
      </button>
      {getOverviewChart(overviewOrder[overviewOrder.length - 1])}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {getBottomLabel({
          overview: overviewOrder[overviewOrder.length - 1],
          currentYearDate: new Date(currentYearData[0]?.date ?? ''),
          currentMonthDate: new Date(currentMonthData[0]?.date ?? ''),
          currentDayDate: new Date(currentDay.date),
        })}
      </span>
    </div>
  );
}
