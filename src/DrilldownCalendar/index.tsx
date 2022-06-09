import { maxIndex } from 'd3';
import { getWeek } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { DayOverviewHeatMap } from '../DayOverviewHeatmap';
import { GlobalOverviewHeatMap } from '../GlobalOverviewHeatmap';
import { MonthOverviewHeatMap } from '../MonthOverviewHeatmap';
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
  return data.filter((ele) => {
    return new Date(ele.date).getFullYear() === year;
  });
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
  return data.filter((ele) => {
    return (
      new Date(ele.date).toLocaleString(undefined, { month: 'short' }) === month
    );
  });
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
    data.find((ele) => {
      const dateObject = new Date(ele.date);
      return (
        getWeek(dateObject) === datum.week && dateObject.getDay() === datum.day
      );
    }) ?? { date: new Date().toISOString(), total: NaN }
  );
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
    fetchData();
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
    let output: JSX.Element = <></>;
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
              setCurrentDay(filterSelectedDatum(currentYearData, d));
              setOverviewOrder((prev) => [
                ...prev,
                'day' as DrilldownCalendarOverview,
              ]);
            }}
            onMonthLabelClick={(d) => {
              setCurrentMonthData(filterMonthData(currentYearData, d));
              setOverviewOrder((prev) => [
                ...prev,
                'month' as DrilldownCalendarOverview,
              ]);
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
              setCurrentDay(filterSelectedDatum(currentMonthData, d));
              setOverviewOrder((prev) => [
                ...prev,
                'day' as DrilldownCalendarOverview,
              ]);
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
              const { year } = d;
              setCurrentYearData(filterDataByYear(globalData, year));
              setOverviewOrder((prev) => [
                ...prev,
                'year' as DrilldownCalendarOverview,
              ]);
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'transparent',
          borderColor: 'transparent',
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
    </div>
  );
}
