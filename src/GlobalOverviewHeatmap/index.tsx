import { select, selectAll, easeLinear, range } from 'd3';
import { useEffect, useRef } from 'react';
import {
  getXScaleAndAxis,
  createColorGenerator,
  fadeAwayElements,
  getColor,
} from '../utils';
import { getGlobalHeatmapCellDimensions, getGlobalData } from './utils';
import type { Margin } from '../utils';
import type { GlobalOverviewHeatmapProps, GlobalOverviewDatum } from './utils';
import type { Selection } from 'd3';

/**
 * Ref: https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99
 * @param param0
 * @returns
 */
export function GlobalOverviewHeatMap({
  data,
  onTooltip,
  onHideTooltip,
  color,
  onCellClick,
  fade,
  onFadeComplete,
  response,
  ...rest
}: GlobalOverviewHeatmapProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const margin: Margin = { top: 50, bottom: 50, left: 50, right: 50 };

    let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined;
    let resize: (() => void) | undefined;
    if (ref.current !== null && data.length > 0) {
      // Create array data, min and max year and min and max total of the years
      const { dataArray, yearExtent, totalExtent } = getGlobalData(data);
      const [startYear, endYear] = yearExtent;
      const [minTotal, maxTotal] = totalExtent;

      // Generates color generator function
      const colorGenerator = createColorGenerator(minTotal, maxTotal, color);

      // Define year labels
      const yearLabels = range(startYear, endYear + 1).map((d) => d.toString());

      // X Scale and X Axis
      const [xScale, xAxis] = getXScaleAndAxis({
        labels: yearLabels,
        element: ref.current,
        margin,
        paddingInner: 0.2,
        response,
      });

      // Heat cell dimensions
      const [cellWidth, cellHeight] = getGlobalHeatmapCellDimensions(
        ref.current,
        xScale,
        margin
      );

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
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'x-axis')
        .call(xAxis);

      // Draw heat cells
      parent
        .selectAll('.heat-cell')
        .data(dataArray)
        .enter()
        .append('rect')
        .attr('class', 'heat-cell')
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('x', (d) => xScale(d.year.toString()) ?? 0)
        .attr('fill', (d) => getColor(colorGenerator, d.total))
        .attr('stroke-width', 1)
        .attr('stroke', ' var(--background_color)');

      // Add text color
      select('.x-axis').selectAll('text').attr('fill', 'var(--primary_color)');

      // Add path color
      select('.x-axis')
        .selectAll('path')
        .attr('stroke', 'var(--primary_color)');

      // Add hover listner to rect cell
      selectAll<SVGRectElement, GlobalOverviewDatum>('.heat-cell')
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
          selectAll<SVGRectElement, GlobalOverviewDatum>('.heat-cell')
            .filter((d) => d.year.toString() !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, GlobalOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      // Add resize listener
      resize = () => {
        if (ref.current !== null) {
          const [newXScale, newXAxis] = getXScaleAndAxis({
            labels: yearLabels,
            element: ref.current,
            margin,
            paddingInner: 0.2,
            response,
          });

          const [newWidth, newHeight] = getGlobalHeatmapCellDimensions(
            ref.current,
            newXScale,
            margin
          );

          // Update X axis
          select<SVGGElement, unknown>('.x-axis')
            .call(newXAxis)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

          // Update heat cells
          selectAll<SVGRectElement, GlobalOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('width', newWidth)
            .attr('height', newHeight)
            .attr('x', (d) => newXScale(d.year.toString()) ?? 0);
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
  }, [color, data, onCellClick, onHideTooltip, onTooltip, response]);

  useEffect(() => {
    if (fade === true) {
      fadeAwayElements(['.heat-cell', '.x-axis'])
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
