import { easeLinear, range, select, selectAll } from 'd3';
import { useEffect, useRef, useState } from 'react';
import {
  createColorGenerator,
  fadeAwayElements,
  getColor,
  getXScaleAndAxis,
  getYScaleAndAxis,
} from '../utils';
import { createXAxisLabel, generateYAxisLabels, getDayData } from './utils';
import type { Margin, CalendarHeatmapDatum } from '../utils';
import type { DayOverviewHeatmapProps, DayOverviewDatum } from './utils';
import type { Selection } from 'd3';

/**
 * Ref: https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99
 * @param param0
 * @returns
 */
export function DayOverviewHeatMap({
  data,
  color,
  onTooltip,
  onHideTooltip,
  onCellClick,
  fade,
  onFadeComplete,
  response,
  fetchDayData,
  showXAxisLabels,
  ...rest
}: DayOverviewHeatmapProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [dayData, setDayData] = useState<CalendarHeatmapDatum>(data);

  useEffect(() => {
    async function fetchData() {
      const details = data.details ?? (await fetchDayData?.(data.date)) ?? [];
      setDayData((prev) => ({ ...prev, details }));
    }
    fetchData().catch((err) => {
      throw err;
    });
  }, [data.date, data.details, fetchDayData]);

  useEffect(() => {
    const margin: Margin = { top: 50, bottom: 50, left: 50, right: 50 };

    let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined;
    let resize: (() => void) | undefined;
    if (
      ref.current !== null &&
      Array.isArray(dayData.details) &&
      dayData.details?.length > 0
    ) {
      // Create array day data and max and min value of the whole day.
      const { dataArray, valueExtent } = getDayData(dayData);
      const binCountPerHour = Math.ceil((dayData.details.length ?? 0) / 24);
      const hourLabels = generateYAxisLabels();
      const xAxisLabels = range(0, binCountPerHour).map((e) =>
        createXAxisLabel(e)
      );

      // Calculate min and max value of all the day in the dataset
      const [minValue, maxValue] = valueExtent;

      // Generates color generator function
      const colorGenerator = createColorGenerator(minValue, maxValue, color);
      // X Scale and X Axis
      const [xScale, xAxis] = getXScaleAndAxis({
        labels: xAxisLabels,
        element: ref.current,
        margin,
        paddingInner: 0,
        response,
      });

      // Y Scale and Y Axis
      const [yScale, yAxis] = getYScaleAndAxis({
        labels: hourLabels,
        element: ref.current,
        margin,
        paddingInner: 0,
        response,
      });

      svg = select(ref.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('cursor', 'pointer');

      // Draw parent 'g' tag
      const parent = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Draw x axis
      if (showXAxisLabels !== false) {
        // Similar to year week axis
        svg
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .attr('class', 'x-axis')
          .call(xAxis);
      }

      // Draw y axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'y-axis')
        .call(yAxis);

      // Draw heat cells
      parent
        .selectAll('.heat-cell')
        .data(dataArray)
        .enter()
        .append('rect')
        .attr('class', 'heat-cell')
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('x', (d) => xScale(createXAxisLabel(d.col)) ?? 0)
        .attr('y', (d) => yScale(hourLabels[d.hour]) ?? 0)
        .attr('fill', (d) => getColor(colorGenerator, d.value))
        .attr('stroke-width', 1)
        .attr('stroke', 'var(--background_color)');

      // Add text color
      selectAll('.x-axis, .y-axis')
        .selectAll('text')
        .attr('fill', 'var(--primary_color)');

      // Add path color
      selectAll('.x-axis, .y-axis')
        .selectAll('path')
        .attr('stroke', 'var(--primary_color)');

      // Add hover and click listner to heat cell
      selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
        .on('mouseover', (e: React.MouseEvent<SVGRectElement>, datum) => {
          select(e.currentTarget).attr('fill-opacity', 0.4);
          onTooltip?.({
            value: datum,
          });
        })
        .on('mousemove', (_e: React.MouseEvent<SVGRectElement>, datum) => {
          onTooltip?.({
            value: datum,
          });
        })
        .on('mouseout', (e: React.MouseEvent<SVGRectElement>) => {
          select(e.currentTarget).attr('fill-opacity', 1);
          onHideTooltip?.();
        })
        .on('click', (_e: React.MouseEvent<SVGRectElement>, datum) => {
          onCellClick?.(datum);
        });

      // Adding animation on mouseover to the labels
      select('.x-axis')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (_e: React.MouseEvent<SVGTextElement>, tickLabel) => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .filter((d) => createXAxisLabel(d.col) !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      select('.y-axis')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (_e: React.MouseEvent<SVGTextElement>, tickLabel) => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .filter((d) => hourLabels[d.hour] !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      // Add resize listener
      resize = () => {
        if (ref.current !== null) {
          const [newXScale, newXAxis] = getXScaleAndAxis({
            labels: xAxisLabels,
            element: ref.current,
            margin,
            paddingInner: 0,
            response,
          });

          const [newYScale, newYAxis] = getYScaleAndAxis({
            labels: hourLabels,
            element: ref.current,
            margin,
            paddingInner: 0,
            response,
          });

          // Update X axis
          if (showXAxisLabels !== false) {
            // Similar to year week axis
            select<SVGGElement, unknown>('.x-axis')
              .call(newXAxis)
              .attr('transform', `translate(${margin.left}, ${margin.top})`);
          }

          // Update Y axis
          select<SVGGElement, unknown>('.y-axis')
            .call(newYAxis)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

          // Update heat cells
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('width', newXScale.bandwidth())
            .attr('height', newYScale.bandwidth())
            .attr('x', (d) => newXScale(createXAxisLabel(d.col)) ?? 0)
            .attr('y', (d) => newYScale(hourLabels[d.hour]) ?? 0);
        }
      };
      window.addEventListener('resize', resize);
    }
    return () => {
      if (resize !== undefined) {
        window.removeEventListener('resize', resize);
      }
      svg?.remove();
    };
  }, [
    color,
    dayData,
    onCellClick,
    onHideTooltip,
    onTooltip,
    response,
    showXAxisLabels,
  ]);

  useEffect(() => {
    // Fade away heat cells, x and y axis
    if (fade === true) {
      fadeAwayElements(['.heat-cell', '.x-axis', '.y-axis'])
        .then(() => {
          onFadeComplete?.();
        })
        .catch((err) => {
          throw err;
        }); // Pass array of selectors
    }
  }, [fade, onFadeComplete]);

  return (
    <div
      {...rest}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        ...rest.style,
      }}
      ref={ref}
    />
  );
}
