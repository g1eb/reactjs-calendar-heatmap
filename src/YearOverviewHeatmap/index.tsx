import { easeLinear, range, select, selectAll, timeMonths } from 'd3';
import { endOfYear, startOfYear } from 'date-fns';
import { useEffect, useRef } from 'react';
import {
  createColorGenerator,
  getYScaleAndAxis,
  fadeAwayElements,
  getXScaleAndAxis,
  getColor,
} from '../utils';
import {
  getYearData,
  getMonthBoundaryPath,
  getWeekPosition,
  fadeMonthBoundaries,
  brightenMonthBoundaries,
  getMonthScaleAndAxis,
} from './utils';
import type { Margin } from '../utils';
import type { YearOverviewHeatmapProps, YearOverviewDatum } from './utils';
import type { Selection } from 'd3';

/**
 * Ref: https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99
 * @param param0
 * @returns
 */
export function YearOverviewHeatMap({
  data, // Assuming we get filtered data of 1 year from parent component.
  color,
  onTooltip,
  onHideTooltip,
  onCellClick,
  onMonthLabelClick,
  fade,
  onFadeComplete,
  response,
  showWeekLabels,
  scaleType,
  ...rest
}: YearOverviewHeatmapProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const margin: Margin = { top: 50, bottom: 50, left: 50, right: 50 };
    let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined;

    let resize: (() => void) | undefined;
    if (ref.current !== null && data.length > 0) {
      const { dataArray, totalExtent } = getYearData(data);
      const [minTotal, maxTotal] = totalExtent;
      // Generates color generator function
      const colorGenerator = createColorGenerator(minTotal, maxTotal, color);

      // Any random date of the year
      const selectedDate = new Date(data[0].date);

      // First date of all months from january till december.
      const monthDates = timeMonths(
        startOfYear(selectedDate),
        endOfYear(selectedDate)
      );

      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekLabels = range(1, 54).map((e) => e.toString());

      // Creating month labels dynamically with 'toLocaleString' function, since month labels may vary based on 'locale'.
      const monthLabels = monthDates.map(
        (e) => e.toLocaleString(undefined, { month: 'short' }) // For consistency
      );

      // Creating a month-wise first-week label positions' array using starting dates of all the months of a year.
      const firstWeekPositions = monthDates.map((d) => getWeekPosition(d));

      // X Axis
      const [xScale, xAxis] = getXScaleAndAxis({
        labels: weekLabels,
        element: ref.current,
        margin,
        paddingInner: 0,
        response,
        align: 'bottom',
      });

      // Y Axis
      const [yScale, yAxis] = getYScaleAndAxis({
        labels: dayLabels,
        element: ref.current,
        margin,
        paddingInner: 0,
        response,
      });

      // Month X Axis
      const [, monthAxis] = getMonthScaleAndAxis({
        weekPositions: firstWeekPositions,
        element: ref.current,
        margin,
        response,
        year: new Date(data[0].date).getFullYear(),
        monthLabels,
        scaleType,
      });

      svg = select(ref.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('cursor', 'pointer');

      // Draw parent 'g' tag for heat cells
      const parent = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Draw week bottom x-axis
      if (showWeekLabels === true) {
        svg
          .append('g')
          .attr(
            'transform',
            `translate(${margin.left}, ${
              ref.current.clientHeight - margin.bottom
            })`
          )
          .attr('class', 'x-axis week')
          .call(xAxis);
      }

      // Draw month top x-axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'x-axis month')
        .call(monthAxis);

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
        .attr('x', (d) => xScale(weekLabels[d.week - 1]) ?? 0)
        .attr('y', (d) => yScale(dayLabels[d.day - 1]) ?? 0)
        .attr('fill', (d) => getColor(colorGenerator, d.total))
        .attr('stroke-width', 0.1) // Decresed it to 0.1 to create contrast between cell borders and month before boundary paths
        .attr(
          'pointer-events',
          (d) => (d.total === 0 ? 'none' : 'visiblePainted') // Ref: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointer-events#usage_notes
        )
        .attr('stroke', 'var(--background_color)');

      const months = parent.append('g'); // 'g' tag to contain paths
      months
        .selectAll('.month-boundary')
        .data(
          /**
           * First date of all months from february till december.
           * We have used months from feb till dec since the month paths breaking will be rendered from start of feb of any year.
           */
          monthDates.slice(1)
        )
        .enter()
        .append('path')
        .attr('class', 'month-boundary')
        .attr('fill', 'none')
        .attr('stroke', 'var(--background_color)')
        .attr('stroke-width', 3)
        .attr('d', (d) => getMonthBoundaryPath(d, xScale, yScale));

      // Add text color
      selectAll('.x-axis , .y-axis')
        .selectAll('text')
        .attr('fill', 'var(--primary_color)');

      // Add path color
      selectAll('.x-axis, .y-axis')
        .selectAll('path')
        .attr('stroke', 'var(--primary_color)');

      // Add hover and click listner to heat cell
      selectAll<SVGRectElement, YearOverviewDatum>('.heat-cell')
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

      // Add hovering effect for y axis labels
      select('.y-axis')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (_e: React.MouseEvent<SVGTextElement>, tickLabel) => {
          selectAll<SVGRectElement, YearOverviewDatum>('.heat-cell')
            .filter((d) => dayLabels[d.day - 1] !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
          fadeMonthBoundaries();
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, YearOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
          brightenMonthBoundaries();
        });

      // Adding animation on mouseover to the month labels
      select<SVGAElement, unknown>('.x-axis.month')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (e: React.MouseEvent<SVGTextElement>) => {
          const monthLabel: string = e.currentTarget.textContent ?? '';
          selectAll<SVGRectElement, YearOverviewDatum>('.heat-cell')
            .filter((d) => d.month !== monthLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
          fadeMonthBoundaries();
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, YearOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
          brightenMonthBoundaries();
        })
        .on('click', (e: React.MouseEvent<SVGTextElement>) => {
          const monthLabel: string = e.currentTarget.textContent ?? '';
          onMonthLabelClick?.(monthLabel);
        });

      // Add resize listener
      resize = () => {
        if (ref.current !== null) {
          const [newXScale, newXAxis] = getXScaleAndAxis({
            labels: weekLabels,
            element: ref.current,
            margin,
            paddingInner: 0,
            response,
            align: 'bottom',
          });

          // Month X Axis
          const [, newMonthAxis] = getMonthScaleAndAxis({
            weekPositions: firstWeekPositions,
            element: ref.current,
            margin,
            response,
            year: new Date(data[0].date).getFullYear(),
            monthLabels,
            scaleType,
          });

          const [newYScale, newYAxis] = getYScaleAndAxis({
            labels: dayLabels,
            element: ref.current,
            margin,
            paddingInner: 0,
            response,
          });

          // Update X axis
          if (showWeekLabels === true) {
            select<SVGGElement, unknown>('.x-axis.week')
              .call(newXAxis)
              .attr(
                'transform',
                `translate(${margin.left}, ${
                  ref.current.clientHeight - margin.bottom
                })`
              );
          }

          // Draw month top x-axis
          select<SVGGElement, unknown>('.x-axis.month').call(newMonthAxis);

          // Update Y axis
          select<SVGGElement, unknown>('.y-axis').call(newYAxis);

          // Update heat cells
          selectAll<SVGRectElement, YearOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('width', newXScale.bandwidth())
            .attr('height', newYScale.bandwidth())
            .attr('x', (d) => newXScale(weekLabels[d.week - 1]) ?? 0)
            .attr('y', (d) => newYScale(dayLabels[d.day - 1]) ?? 0);

          // Update month boundaries
          selectAll<SVGGElement, Date>('.month-boundary')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('d', (d) => getMonthBoundaryPath(d, newXScale, newYScale));
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
    data,
    onCellClick,
    onMonthLabelClick,
    onHideTooltip,
    onTooltip,
    response,
    showWeekLabels,
    scaleType,
  ]);

  useEffect(() => {
    if (fade === true) {
      fadeAwayElements([
        '.heat-cell',
        '.x-axis',
        '.y-axis',
        '.month-boundary',
      ]).then(() => {
        onFadeComplete?.();
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
