import * as React from 'react'

import moment from 'moment'
import * as d3 from 'd3'

import styles from './calendar-heatmap.css'


class CalendarHeatmap extends React.Component {

  constructor(props) {
    super(props)

    this.settings = {
      gutter: 5,
      item_gutter: 1,
      width: 1000,
      height: 200,
      item_size: 10,
      label_padding: 40,
      max_block_height: 20,
      transition_duration: 500,
      tooltip_width: 250,
      tooltip_padding: 15,
    }

    this.in_transition = false
    this.overview = this.props.overview
    this.history = ['global']
    this.selected = {}

    this.calcDimensions = this.calcDimensions.bind(this)
  }

  componentDidMount() {
    this.createElements()
    this.parseData()
    this.drawChart()

    window.addEventListener('resize', this.calcDimensions)
  }

  componentDidUpdate() {
    this.parseData()
    this.drawChart()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcDimensions)
  }

  createElements() {
    // Create svg element
    this.svg = d3.select('#calendar-heatmap')
      .append('svg')
      .attr('class', 'svg')

    // Create other svg elements
    this.items = this.svg.append('g')
    this.labels = this.svg.append('g')
    this.buttons = this.svg.append('g')

    // Add tooltip to the same element as main svg
    this.tooltip = d3.select('#calendar-heatmap')
      .append('div')
      .attr('class', styles.heatmapTooltip)
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('position', 'absolute')
      .style('z-index', 9999)
      .style('width', '250px')
      .style('max-width', '250px')
      .style('overflow', 'hidden')
      .style('padding', '15px')
      .style('font-size', '12px')
      .style('line-height', '14px')
      .style('color', 'rgb(51, 51, 51)')
      .style('background', 'rgba(255, 255, 255, 0.75)')

    this.calcDimensions()
  }

  // Calculate dimensions based on available width
  calcDimensions() {
    let dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000)
    let colIndex = Math.trunc(dayIndex / 7)
    let numWeeks = colIndex + 1

    this.settings.width = this.container.offsetWidth < 1000 ? 1000 : this.container.offsetWidth
    this.settings.item_size = ((this.settings.width - this.settings.label_padding) / numWeeks - this.settings.gutter)
    this.settings.height = this.settings.label_padding + 7 * (this.settings.item_size + this.settings.gutter)
    this.svg.attr('width', this.settings.width)
      .attr('height', this.settings.height)

    if ( !!this.props.data && !!this.props.data[0].summary ) {
      this.drawChart()
    }
  }

  parseData() {
    if ( !this.props.data ) { return }

    // Get daily summary if that was not provided
    if ( !this.props.data[0].summary ) {
      this.props.data.map(d => {
        let summary = d.details.reduce((uniques, project) => {
          if (!uniques[project.name]) {
            uniques[project.name] = {
              'value': project.value
            }
          } else {
            uniques[project.name].value += project.value
          }
          return uniques
        }, {})
        let unsorted_summary = Object.keys(summary).map(key => {
          return {
            'name': key,
            'value': summary[key].value
          }
        })
        d.summary = unsorted_summary.sort((a, b) => {
          return b.value - a.value
        })
        return d
      })
    }
  }

  drawChart() {
    if ( this.overview === 'global' ) {
      this.drawGlobalOverview()
    } else if ( this.overview === 'year' ) {
      this.drawYearOverview()
    } else if ( this.overview === 'month' ) {
      this.drawMonthOverview()
    } else if ( this.overview === 'week' ) {
      this.drawWeekOverview()
    } else if ( this.overview === 'day' ) {
      this.drawDayOverview()
    }
  }


  /**
   * Draw global overview (multiple years)
   */
  drawGlobalOverview() {

    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview)
    }

    // Define start and end of the dataset
    let start = moment(this.props.data[0].date).startOf('year')
    let end = moment(this.props.data[this.props.data.length - 1].date).endOf('year')

    // Define array of years and total values
    let year_data = d3.timeYears(start, end).map(d => {
      let date = moment(d)
      let getSummary = () => {
        let summary = this.props.data.reduce((summary, d) => {
          if (moment(d.date).year() === date.year()) {
            d.summary.map(item => {
              if (!summary[item.name]) {
                summary[item.name] = {
                  'value': item.value,
                }
              } else {
                summary[item.name].value += item.value
              }
            })
          }
          return summary
        }, {})
        let unsorted_summary = Object.keys(summary).map(key => {
          return {
            'name': key,
            'value': summary[key].value
          }
        })
        return unsorted_summary.sort((a, b) => {
          return b.value - a.value
        })
      }
      return {
        'date': date,
        'total': this.props.data.reduce((prev, current) => {
          if (moment(current.date).year() === date.year()) {
            prev += current.total
          }
          return prev
        }, 0),
        'summary': getSummary(),
      }
    })

    // Calculate max value of all the years in the dataset
    let max_value = d3.max(year_data, d => {
      return d.total
    })

    // Define year labels and axis
    let year_labels = d3.timeYears(start, end).map(d => {
      return moment(d)
    })
    let yearScale = d3.scaleBand()
      .rangeRound([0, this.settings.width])
      .padding([0.05])
      .domain(year_labels.map(d => {
        return d.year()
      }))

    // Add global data items to the overview
    this.items.selectAll('.item-block-year').remove()
    let item_block = this.items.selectAll('.item-block-year')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-year')
      .style('cursor', 'pointer')
      .attr('width', () => {
        return (this.settings.width - this.settings.label_padding) / year_labels.length - this.settings.gutter * 5
      })
      .attr('height', () => {
        return this.settings.height - this.settings.label_padding
      })
      .attr('transform', d => {
        return 'translate(' + yearScale(d.date.year()) + ',' + this.settings.tooltip_padding * 2 + ')'
      })
      .attr('fill', d => {
        let color = d3.scaleLinear()
          .range(['#ffffff', this.props.color])
          .domain([-0.15 * max_value, max_value])
        return color(d.total) || '#ff4500'
      })
      .on('click', d => {
        if (this.in_transition) { return }

        // Set in_transition flag
        this.in_transition = true

        // Set selected date to the one clicked on
        this.selected = d

        // Hide tooltip
        this.hideTooltip()

        // Remove all global overview related items and labels
        this.removeGlobalOverview()

        // Redraw the chart
        this.overview = 'year'
        this.drawChart()
      })
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        if (this.in_transition) { return }

        // Construct tooltip
        let tooltip_html = ''
        tooltip_html += '<div><span><strong>Total time tracked:</strong></span>'

        let sec = parseInt(d.total, 10)
        let days = Math.floor(sec / 86400)
        if (days > 0) {
          tooltip_html += '<span>' + (days === 1 ? '1 day' : days + ' days') + '</span></div>'
        }
        let hours = Math.floor((sec - (days * 86400)) / 3600)
        if (hours > 0) {
          if (days > 0) {
            tooltip_html += '<div><span></span><span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>'
          } else {
            tooltip_html += '<span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>'
          }
        }
        let minutes = Math.floor((sec - (days * 86400) - (hours * 3600)) / 60)
        if (minutes > 0) {
          if (days > 0 || hours > 0) {
            tooltip_html += '<div><span></span><span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>'
          } else {
            tooltip_html += '<span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>'
          }
        }
        tooltip_html += '<br />'

        // Add summary to the tooltip
        if (d.summary.length <= 5) {
          let counter = 0
          while ( counter < d.summary.length ) {
            tooltip_html += '<div><span><strong>' + d.summary[counter].name + '</strong></span>'
            tooltip_html += '<span>' + this.formatTime(d.summary[counter].value) + '</span></div>'
            counter++
          }
        } else {
          let counter = 0
          while ( counter < 5 ) {
            tooltip_html += '<div><span><strong>' + d.summary[counter].name + '</strong></span>'
            tooltip_html += '<span>' + this.formatTime(d.summary[counter].value) + '</span></div>'
            counter++
          }

          tooltip_html += '<br />'

          counter = 5
          let other_projects_sum = 0
          while ( counter < d.summary.length ) {
            other_projects_sum = +d.summary[counter].value
            counter++
          }
          tooltip_html += '<div><span><strong>Other:</strong></span>'
          tooltip_html += '<span>' + this.formatTime(other_projects_sum) + '</span></div>'
        }

        // Calculate tooltip position
        let x = yearScale(d.date.year()) + this.settings.tooltip_padding * 2
        while (this.settings.width - x < (this.settings.tooltip_width + this.settings.tooltip_padding * 5)) {
          x -= 10
        }
        let y = this.settings.tooltip_padding * 3

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }
        this.hideTooltip()
      })
      .transition()
      .delay((d, i) => {
        return this.settings.transition_duration * (i + 1) / 10
      })
      .duration(() => {
        return this.settings.transition_duration
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call((transition, callback) => {
        if (transition.empty()) {
          callback()
        }
        let n = 0
        transition
          .each(() => {++n })
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments)
            }
          })
      }, () => {
        this.in_transition = false
      })

    // Add year labels
    this.labels.selectAll('.label-year').remove()
    this.labels.selectAll('.label-year')
      .data(year_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-year')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return d.year()
      })
      .attr('x', d => {
        return yearScale(d.year())
      })
      .attr('y', this.settings.label_padding / 2)
      .on('mouseenter', (event, year_label) => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (moment(d.date).year() === year_label.year()) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('click', (event, d) => {
        if (this.in_transition) { return }

        // Set in_transition flag
        this.in_transition = true

        // Set selected year to the one clicked on
        this.selected = { date: d }

        // Hide tooltip
        this.hideTooltip()

        // Remove all global overview related items and labels
        this.removeGlobalOverview()

        // Redraw the chart
        this.overview = 'year'
        this.drawChart()
      })
  }


  /**
   * Draw year overview
   */
  drawYearOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview)
    }

    // Define start and end date of the selected year
    let start_of_year = moment(this.selected.date).startOf('year')
    let end_of_year = moment(this.selected.date).endOf('year')

    // Filter data down to the selected year
    let year_data = this.props.data.filter(d => {
      return start_of_year <= moment(d.date) && moment(d.date) < end_of_year
    })

    // Calculate max value of the year data
    let max_value = d3.max(year_data, d => d.total)

    let color = d3.scaleLinear()
      .range(['#ffffff', this.props.color])
      .domain([-0.15 * max_value, max_value])

    let calcItemX = (d) => {
      let date = moment(d.date)
      let dayIndex = Math.round((date - moment(start_of_year).startOf('week')) / 86400000)
      let colIndex = Math.trunc(dayIndex / 7)
      return colIndex * (this.settings.item_size + this.settings.gutter) + this.settings.label_padding
    }

    let calcItemY = d => {
      return this.settings.label_padding + moment(d.date).weekday() * (this.settings.item_size + this.settings.gutter)
    }

    let calcItemSize = d => {
      if ( max_value <= 0 ) {
        return this.settings.item_size
      }
      return this.settings.item_size * 0.75 + (this.settings.item_size * d.total / max_value) * 0.25
    }

    this.items.selectAll('.item-circle').remove()
    this.items.selectAll('.item-circle')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-circle')
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .attr('x', d => {
        return calcItemX(d) + (this.settings.item_size - calcItemSize(d)) / 2
      })
      .attr('y', d => {
        return calcItemY(d) + (this.settings.item_size - calcItemSize(d)) / 2
      })
      .attr('rx', d => {
        return calcItemSize(d)
      })
      .attr('ry', d => {
        return calcItemSize(d)
      })
      .attr('width', d => {
        return calcItemSize(d)
      })
      .attr('height', d => {
        return calcItemSize(d)
      })
      .attr('fill', d => {
        return (d.total > 0) ? color(d.total) : 'transparent'
      })
      .on('click', (event, d) => {
        if (this.in_transition) { return }

        // Don't transition if there is no data to show
        if (d.total === 0) { return }

        this.in_transition = true

        // Set selected date to the one clicked on
        this.selected = d

        // Hide tooltip
        this.hideTooltip()

        // Remove all year overview related items and labels
        this.removeYearOverview()

        // Redraw the chart
        this.overview = 'day'
        this.drawChart()
      })
      .on('mouseover', (event, d) => {
        if (this.in_transition) { return }

        // Pulsating animation
        let circle = d3.select(event.currentTarget)
        let repeat = () => {
          circle = circle.transition()
            .duration(this.settings.transition_duration)
            .ease(d3.easeLinear)
            .attr('x', d => {
              return calcItemX(d) - (this.settings.item_size * 1.1 - this.settings.item_size) / 2
            })
            .attr('y', d => {
              return calcItemY(d) - (this.settings.item_size * 1.1 - this.settings.item_size) / 2
            })
            .attr('width', this.settings.item_size * 1.1)
            .attr('height', this.settings.item_size * 1.1)
            .transition()
            .duration(this.settings.transition_duration)
            .ease(d3.easeLinear)
            .attr('x', d => {
              return calcItemX(d) + (this.settings.item_size - calcItemSize(d)) / 2
            })
            .attr('y', d => {
              return calcItemY(d) + (this.settings.item_size - calcItemSize(d)) / 2
            })
            .attr('width', d => {
              return calcItemSize(d)
            })
            .attr('height', d => {
              return calcItemSize(d)
            })
            .on('end', repeat)
        }
        repeat()

        // Construct tooltip
        let tooltip_html = ''
        tooltip_html += `<div class="${styles.header}"><strong>${d.total ? this.formatTime(d.total) : 'No time'} tracked</strong></div>`
        tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY') + '</div><br>'

        // Add summary to the tooltip
        let counter = 0
        while ( counter < d.summary.length ) {
          tooltip_html += '<div><span><strong>' + d.summary[counter].name + '</strong></span>'
          tooltip_html += '<span>' + this.formatTime(d.summary[counter].value) + '</span></div>'
          counter++
        }

        // Calculate tooltip position
        let x = calcItemX(d) + this.settings.item_size
        if (this.settings.width - x < (this.settings.tooltip_width + this.settings.tooltip_padding * 3)) {
          x -= this.settings.tooltip_width + this.settings.tooltip_padding * 2
        }
        let y = calcItemY(d) + this.settings.item_size

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('mouseout', (event, d) => {
        if (this.in_transition) { return }

        // Set circle radius back to what its supposed to be
        d3.select(event.currentTarget).transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .attr('x', d => {
            return calcItemX(d) + (this.settings.item_size - calcItemSize(d)) / 2
          })
          .attr('y', d => {
            return calcItemY(d) + (this.settings.item_size - calcItemSize(d)) / 2
          })
          .attr('width', d => {
            return calcItemSize(d)
          })
          .attr('height', d => {
            return calcItemSize(d)
          })

        // Hide tooltip
        this.hideTooltip()
      })
      .transition()
      .delay(() => {
        return (Math.cos(Math.PI * Math.random()) + 1) * this.settings.transition_duration
      })
      .duration(() => {
        return this.settings.transition_duration
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call((transition, callback) => {
        if (transition.empty()) {
          callback()
        }
        let n = 0
        transition
          .each(() => ++n)
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments)
            }
          })
      }, () => {
        this.in_transition = false
      })

    // Add month labels
    let month_labels = d3.timeMonths(start_of_year, end_of_year)
    let monthScale = d3.scaleLinear()
      .range([0, this.settings.width])
      .domain([0, month_labels.length])
    this.labels.selectAll('.label-month').remove()
    this.labels.selectAll('.label-month')
      .data(month_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-month')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return d.toLocaleDateString('en-us', { month: 'short' })
      })
      .attr('x', (d, i) => {
        return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2
      })
      .attr('y', this.settings.label_padding / 2)
      .on('mouseenter', (event, d) => {
        if (this.in_transition) { return }

        let selected_month = moment(d)
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('click', (event, d) => {
        if (this.in_transition) { return }

        // Check month data
        let month_data = this.props.data.filter(e => {
          return moment(d).startOf('month') <= moment(e.date) && moment(e.date) < moment(d).endOf('month')
        })

        // Don't transition if there is no data to show
        if (!month_data.length) { return }

        // Set selected month to the one clicked on
        this.selected = { date: d }

        this.in_transition = true

        // Hide tooltip
        this.hideTooltip()

        // Remove all year overview related items and labels
        this.removeYearOverview()

        // Redraw the chart
        this.overview = 'month'
        this.drawChart()
      })

    // Add day labels
    let day_labels = d3.timeDays(moment().startOf('week'), moment().endOf('week'))
    let dayScale = d3.scaleBand()
      .rangeRound([this.settings.label_padding, this.settings.height])
      .domain(day_labels.map(d => {
        return moment(d).weekday()
      }))
    this.labels.selectAll('.label-day').remove()
    this.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('x', this.settings.label_padding / 3)
      .attr('y', (d, i) => {
        return dayScale(i) + dayScale.bandwidth() / 1.75
      })
      .style('text-anchor', 'left')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return moment(d).format('dddd')[0]
      })
      .on('mouseenter', (event, d) => {
        if (this.in_transition) { return }

        let selected_day = moment(d)
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })

    // Add button to switch back to previous overview
    this.drawButton()
  }


  /**
   * Draw month overview
   */
  drawMonthOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview)
    }

    // Define beginning and end of the month
    let start_of_month = moment(this.selected.date).startOf('month')
    let end_of_month = moment(this.selected.date).endOf('month')

    // Filter data down to the selected month
    let month_data = this.props.data.filter(d => {
      return start_of_month <= moment(d.date) && moment(d.date) < end_of_month
    })
    let max_value = d3.max(month_data, d => {
      return d3.max(d.summary, d => {
        return d.value
      })
    })

    // Define day labels and axis
    let day_labels = d3.timeDays(moment().startOf('week'), moment().endOf('week'))
    let dayScale = d3.scaleBand()
      .rangeRound([this.settings.label_padding, this.settings.height])
      .domain(day_labels.map(d => {
        return moment(d).weekday()
      }))

    // Define week labels and axis
    let week_labels = [start_of_month.clone()]
    while (start_of_month.week() !== end_of_month.week()) {
      week_labels.push(start_of_month.add(1, 'week').clone())
    }
    let weekScale = d3.scaleBand()
      .rangeRound([this.settings.label_padding, this.settings.width])
      .padding([0.05])
      .domain(week_labels.map(weekday => {
        return weekday.week()
      }))

    // Add month data items to the overview
    this.items.selectAll('.item-block-month').remove()
    let item_block = this.items.selectAll('.item-block-month')
      .data(month_data)
      .enter()
      .append('g')
      .attr('class', 'item item-block-month')
      .style('cursor', 'pointer')
      .attr('width', () => {
        return (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5
      })
      .attr('height', () => {
        return Math.min(dayScale.bandwidth(), this.settings.max_block_height)
      })
      .attr('transform', d => {
        return 'translate(' + weekScale(moment(d.date).week()) + ',' + ((dayScale(moment(d.date).weekday()) + dayScale.bandwidth() / 1.75) - 15) + ')'
      })
      .attr('total', d => {
        return d.total
      })
      .attr('date', d => {
        return d.date
      })
      .attr('offset', 0)
      .on('click', (event, d) => {
        if (this.in_transition) { return }

        // Don't transition if there is no data to show
        if (d.total === 0) { return }

        this.in_transition = true

        // Set selected date to the one clicked on
        this.selected = d

        // Hide tooltip
        this.hideTooltip()

        // Remove all month overview related items and labels
        this.removeMonthOverview()

        // Redraw the chart
        this.overview = 'day'
        this.drawChart()
      })

    let item_width = (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5
    let itemScale = d3.scaleLinear()
      .rangeRound([0, item_width])

    let item_gutter = this.settings.item_gutter
    item_block.selectAll('.item-block-rect')
      .data(d => d.summary)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-rect')
      .style('cursor', 'pointer')
      .attr('x', function(d) {
        let total = parseInt(d3.select(this.parentNode).attr('total'))
        let offset = parseInt(d3.select(this.parentNode).attr('offset'))
        itemScale.domain([0, total])
        d3.select(this.parentNode).attr('offset', offset + itemScale(d.value))
        return offset
      })
      .attr('width', function(d) {
        let total = parseInt(d3.select(this.parentNode).attr('total'))
        itemScale.domain([0, total])
        return Math.max((itemScale(d.value) - item_gutter), 1)
      })
      .attr('height', () => {
        return Math.min(dayScale.bandwidth(), this.settings.max_block_height)
      })
      .attr('fill', d => {
        let color = d3.scaleLinear()
          .range(['#ffffff', this.props.color])
          .domain([-0.15 * max_value, max_value])
        return color(d.value) || '#ff4500'
      })
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        if (this.in_transition) { return }

        // Get date from the parent node
        let parentNode = d3.select(event.currentTarget.parentNode)
        let date = new Date(parentNode.attr('date'))

        // Construct tooltip
        let tooltip_html = ''
        tooltip_html += `<div class="${styles.header}"><strong>${d.name}</strong></div><br>`
        tooltip_html += '<div><strong>' + (d.value ? this.formatTime(d.value) : 'No time') + ' tracked</strong></div>'
        tooltip_html += '<div>on ' + moment(date).format('dddd, MMM Do YYYY') + '</div>'

        // Calculate tooltip position
        let x = weekScale(moment(date).week()) + this.settings.tooltip_padding
        while (this.settings.width - x < (this.settings.tooltip_width + this.settings.tooltip_padding * 3)) {
          x -= 10
        }
        let y = dayScale(moment(date).weekday()) + this.settings.tooltip_padding * 2

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }
        this.hideTooltip()
      })
      .transition()
      .delay(() => {
        return (Math.cos(Math.PI * Math.random()) + 1) * this.settings.transition_duration
      })
      .duration(() => {
        return this.settings.transition_duration
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call((transition, callback) => {
        if (transition.empty()) {
          callback()
        }
        let n = 0
        transition
          .each(() => ++n)
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments)
            }
          })
      }, () => {
        this.in_transition = false
      })

    // Add week labels
    this.labels.selectAll('.label-week').remove()
    this.labels.selectAll('.label-week')
      .data(week_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-week')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return 'Week ' + d.week()
      })
      .attr('x', d => {
        return weekScale(d.week())
      })
      .attr('y', this.settings.label_padding / 2)
      .on('mouseenter', (event, weekday) => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (moment(d.date).week() === weekday.week()) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('click', (event, d) => {
        if (this.in_transition) { return }

        // Check week data
        let week_data = this.props.data.filter(e => {
          return d.startOf('week') <= moment(e.date) && moment(e.date) < d.endOf('week')
        })

        // Don't transition if there is no data to show
        if (!week_data.length) { return }

        this.in_transition = true

        // Set selected month to the one clicked on
        this.selected = { date: d }

        // Hide tooltip
        this.hideTooltip()

        // Remove all year overview related items and labels
        this.removeMonthOverview()

        // Redraw the chart
        this.overview = 'week'
        this.drawChart()
      })

    // Add day labels
    this.labels.selectAll('.label-day').remove()
    this.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('x', this.settings.label_padding / 3)
      .attr('y', (d, i) => {
        return dayScale(i) + dayScale.bandwidth() / 1.75
      })
      .style('text-anchor', 'left')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return moment(d).format('dddd')[0]
      })
      .on('mouseenter', (event, d) => {
        if (this.in_transition) { return }

        let selected_day = moment(d)
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })

    // Add button to switch back to previous overview
    this.drawButton()
  }


  /**
   * Draw week overview
   */
  drawWeekOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview)
    }

    // Define beginning and end of the week
    let start_of_week = moment(this.selected.date).startOf('week')
    let end_of_week = moment(this.selected.date).endOf('week')

    // Filter data down to the selected week
    let week_data = this.props.data.filter(d => {
      return start_of_week <= moment(d.date) && moment(d.date) < end_of_week
    })
    let max_value = d3.max(week_data, d => {
      return d3.max(d.summary, d => {
        return d.value
      })
    })

    // Define day labels and axis
    let day_labels = d3.timeDays(moment().startOf('week'), moment().endOf('week'))
    let dayScale = d3.scaleBand()
      .rangeRound([this.settings.label_padding, this.settings.height])
      .domain(day_labels.map(d => {
        return moment(d).weekday()
      }))

    // Define week labels and axis
    let week_labels = [start_of_week]
    let weekScale = d3.scaleBand()
      .rangeRound([this.settings.label_padding, this.settings.width])
      .padding([0.01])
      .domain(week_labels.map(weekday => {
        return weekday.week()
      }))

    // Add week data items to the overview
    this.items.selectAll('.item-block-week').remove()
    let item_block = this.items.selectAll('.item-block-week')
      .data(week_data)
      .enter()
      .append('g')
      .attr('class', 'item item-block-week')
      .style('cursor', 'pointer')
      .attr('width', () => {
        return (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5
      })
      .attr('height', () => {
        return Math.min(dayScale.bandwidth(), this.settings.max_block_height)
      })
      .attr('transform', d => {
        return 'translate(' + weekScale(moment(d.date).week()) + ',' + ((dayScale(moment(d.date).weekday()) + dayScale.bandwidth() / 1.75) - 15) + ')'
      })
      .attr('total', d =>{
        return d.total
      })
      .attr('date', d => {
        return d.date
      })
      .attr('offset', 0)
      .on('click', (event, d) => {
        if (this.in_transition) { return }

        // Don't transition if there is no data to show
        if (d.total === 0) { return }

        this.in_transition = true

        // Set selected date to the one clicked on
        this.selected = d

        // Hide tooltip
        this.hideTooltip()

        // Remove all week overview related items and labels
        this.removeWeekOverview()

        // Redraw the chart
        this.overview = 'day'
        this.drawChart()
      })

    let item_width = (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5
    let itemScale = d3.scaleLinear()
      .rangeRound([0, item_width])

    let item_gutter = this.settings.item_gutter
    item_block.selectAll('.item-block-rect')
      .data(d => d.summary)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-rect')
      .style('cursor', 'pointer')
      .attr('x', function(d) {
        let total = parseInt(d3.select(this.parentNode).attr('total'))
        let offset = parseInt(d3.select(this.parentNode).attr('offset'))
        itemScale.domain([0, total])
        d3.select(this.parentNode).attr('offset', offset + itemScale(d.value))
        return offset
      })
      .attr('width', function(d) {
        let total = parseInt(d3.select(this.parentNode).attr('total'))
        itemScale.domain([0, total])
        return Math.max((itemScale(d.value) - item_gutter), 1)
      })
      .attr('height', () => {
        return Math.min(dayScale.bandwidth(), this.settings.max_block_height)
      })
      .attr('fill', d => {
        let color = d3.scaleLinear()
          .range(['#ffffff', this.props.color])
          .domain([-0.15 * max_value, max_value])
        return color(d.value) || '#ff4500'
      })
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        if (this.in_transition) { return }

        // Get date from the parent node
        let parentNode = d3.select(event.currentTarget.parentNode)
        let date = new Date(parentNode.attr('date'))

        // Construct tooltip
        let tooltip_html = ''
        tooltip_html += `<div class="${styles.header}"><strong>${d.name}</strong></div><br>`
        tooltip_html += '<div><strong>' + (d.value ? this.formatTime(d.value) : 'No time') + ' tracked</strong></div>'
        tooltip_html += '<div>on ' + moment(date).format('dddd, MMM Do YYYY') + '</div>'

        // Calculate tooltip position
        let total = parseInt(parentNode.attr('total'))
        itemScale.domain([0, total])
        let x = parseInt(d3.select(event.currentTarget).attr('x')) + itemScale(d.value) / 4 + this.settings.tooltip_width / 4
        while (this.settings.width - x < (this.settings.tooltip_width + this.settings.tooltip_padding * 3)) {
          x -= 10
        }
        let y = dayScale(moment(date).weekday()) + this.settings.tooltip_padding * 1.5

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }
        this.hideTooltip()
      })
      .transition()
      .delay(() => {
        return (Math.cos(Math.PI * Math.random()) + 1) * this.settings.transition_duration
      })
      .duration(() => {
        return this.settings.transition_duration
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call((transition, callback) => {
        if (transition.empty()) {
          callback()
        }
        let n = 0
        transition
          .each(() => ++n)
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments)
            }
          })
      }, () => {
        this.in_transition = false
      })

    // Add week labels
    this.labels.selectAll('.label-week').remove()
    this.labels.selectAll('.label-week')
      .data(week_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-week')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return 'Week ' + d.week()
      })
      .attr('x', d => {
        return weekScale(d.week())
      })
      .attr('y', this.settings.label_padding / 2)
      .on('mouseenter', (event, weekday) => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (moment(d.date).week() === weekday.week()) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })

    // Add day labels
    this.labels.selectAll('.label-day').remove()
    this.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('x', this.settings.label_padding / 3)
      .attr('y', (d, i) => {
        return dayScale(i) + dayScale.bandwidth() / 1.75
      })
      .style('text-anchor', 'left')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return moment(d).format('dddd')[0]
      })
      .on('mouseenter', (event, d) => {
        if (this.in_transition) { return }

        let selected_day = moment(d)
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })

    // Add button to switch back to previous overview
    this.drawButton()
  }


  /**
   * Draw day overview
   */
  drawDayOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview)
    }

    // Initialize selected date to today if it was not set
    if (!Object.keys(this.selected).length) {
      this.selected = this.props.data[this.props.data.length - 1]
    }

    let project_labels = this.selected.summary.map(project => {
      return project.name
    })
    let projectScale = d3.scaleBand()
      .rangeRound([this.settings.label_padding, this.settings.height])
      .domain(project_labels)

    let itemScale = d3.scaleTime()
      .range([this.settings.label_padding * 2, this.settings.width])
      .domain([moment(this.selected.date).startOf('day'), moment(this.selected.date).endOf('day')])
    this.items.selectAll('.item-block').remove()
    this.items.selectAll('.item-block')
      .data(this.selected.details)
      .enter()
      .append('rect')
      .attr('class', 'item item-block')
      .style('cursor', 'pointer')
      .attr('x', d => {
        return itemScale(moment(d.date))
      })
      .attr('y', d => {
        return (projectScale(d.name) + projectScale.bandwidth() / 2) - 15
      })
      .attr('width', d => {
        let end = itemScale(d3.timeSecond.offset(moment(d.date), d.value))
        return Math.max((end - itemScale(moment(d.date))), 1)
      })
      .attr('height', () => {
        return Math.min(projectScale.bandwidth(), this.settings.max_block_height)
      })
      .attr('fill', () => {
        return this.props.color
      })
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        if (this.in_transition) { return }

        // Construct tooltip
        let tooltip_html = ''
        tooltip_html += `<div class="${styles.header}"><strong>${d.name}</strong><div><br>`
        tooltip_html += '<div><strong>' + (d.value ? this.formatTime(d.value) : 'No time') + ' tracked</strong></div>'
        tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY HH:mm') + '</div>'

        // Calculate tooltip position
        let x = d.value * 100 / (60 * 60 * 24) + itemScale(moment(d.date))
        while (this.settings.width - x < (this.settings.tooltip_width + this.settings.tooltip_padding * 3)) {
          x -= 10
        }
        let y = projectScale(d.name) + projectScale.bandwidth() / 2 + this.settings.tooltip_padding / 2

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }
        this.hideTooltip()
      })
      .on('click', (event, d) => {
        if (!!this.props.handler && typeof this.props.handler == 'function') {
          this.props.handler(d)
        }
      })
      .transition()
      .delay(() => {
        return (Math.cos(Math.PI * Math.random()) + 1) * this.settings.transition_duration
      })
      .duration(() => {
        return this.settings.transition_duration
      })
      .ease(d3.easeLinear)
      .style('opacity', 0.5)
      .call((transition, callback) => {
        if (transition.empty()) {
          callback()
        }
        let n = 0
        transition
          .each(() => ++n)
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments)
            }
          })
      }, () => {
        this.in_transition = false
      })

    // Add time labels
    let timeLabels = d3.timeHours(
      moment(this.selected.date).startOf('day'),
      moment(this.selected.date).endOf('day')
    )
    let timeScale = d3.scaleTime()
      .range([this.settings.label_padding * 2, this.settings.width])
      .domain([0, timeLabels.length])
    this.labels.selectAll('.label-time').remove()
    this.labels.selectAll('.label-time')
      .data(timeLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-time')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => {
        return moment(d).format('HH:mm')
      })
      .attr('x', (d, i) => {
        return timeScale(i)
      })
      .attr('y', this.settings.label_padding / 2)
      .on('mouseenter', (event, d) => {
        if (this.in_transition) { return }

        let selected = itemScale(moment(d))
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            let start = itemScale(moment(d.date))
            let end = itemScale(moment(d.date).add(d.value, 'seconds'))
            return (selected >= start && selected <= end) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 0.5)
      })

    // Add project labels
    let label_padding = this.settings.label_padding
    this.labels.selectAll('.label-project').remove()
    this.labels.selectAll('.label-project')
      .data(project_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-project')
      .style('cursor', 'pointer')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('x', this.settings.gutter)
      .attr('y', d => {
        return projectScale(d) + projectScale.bandwidth() / 2
      })
      .attr('min-height', () => {
        return projectScale.bandwidth()
      })
      .style('text-anchor', 'left')
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(d => d)
      .each(function() {
        let obj = d3.select(this),
          text_length = obj.node().getComputedTextLength(),
          text = obj.text()
        while (text_length > (label_padding * 1.5) && text.length > 0) {
          text = text.slice(0, -1)
          obj.text(text + '...')
          text_length = obj.node().getComputedTextLength()
        }
      })
      .on('mouseenter', (event, project) => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', d => {
            return (d.name === project) ? 1 : 0.1
          })
      })
      .on('mouseout', () => {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 0.5)
      })

    // Add button to switch back to previous overview
    this.drawButton()
  }


  /**
   * Draw the button for navigation purposes
   */
  drawButton() {
    this.buttons.selectAll('.button').remove()
    let button = this.buttons.append('g')
      .attr('class', 'button button-back')
      .style('cursor', 'pointer')
      .attr('fill', 'transparent')
      .style('opacity', 0)
      .style('stroke-width', 2)
      .style('stroke', 'rgb(170, 170, 170)')
      .on('click', () => {
        if (this.in_transition) { return }

        // Set transition boolean
        this.in_transition = true

        // Clean the canvas from whichever overview type was on
        if (this.overview === 'year') {
          this.removeYearOverview()
        } else if (this.overview === 'month') {
          this.removeMonthOverview()
        } else if (this.overview === 'week') {
          this.removeWeekOverview()
        } else if (this.overview === 'day') {
          this.removeDayOverview()
        }

        // Redraw the chart
        this.history.pop()
        this.overview = this.history.pop()
        this.drawChart()
      })
    button.append('circle')
      .attr('cx', this.settings.label_padding / 2.25)
      .attr('cy', this.settings.label_padding / 2.5)
      .attr('r', this.settings.item_size / 2)
    button.append('text')
      .style('stroke-width', 1)
      .style('text-anchor', 'middle')
      .style('fill', 'rgb(170, 170, 170)')
      .attr('x', this.settings.label_padding / 2.25)
      .attr('y', this.settings.label_padding / 2.5)
      .attr('dy', () => {
        return Math.floor(this.settings.width / 100) / 3
      })
      .attr('font-size', () => {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .html('&#x2190')
    button.transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 1)
  }


  /**
   * Transition and remove items and labels related to global overview
   */
  removeGlobalOverview() {
    this.items.selectAll('.item-block-year')
      .transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .remove()
    this.labels.selectAll('.label-year').remove()
  }


  /**
   * Transition and remove items and labels related to year overview
   */
  removeYearOverview() {
    this.items.selectAll('.item-circle')
      .transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .remove()
    this.labels.selectAll('.label-day').remove()
    this.labels.selectAll('.label-month').remove()
    this.hideBackButton()
  }


  /**
   * Transition and remove items and labels related to month overview
   */
  removeMonthOverview() {
    this.items.selectAll('.item-block-month').selectAll('.item-block-rect')
      .transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .attr('x', (d, i) => {
        return (i % 2 === 0) ? -this.settings.width / 3 : this.settings.width / 3
      })
      .remove()
    this.labels.selectAll('.label-day').remove()
    this.labels.selectAll('.label-week').remove()
    this.hideBackButton()
  }


  /**
   * Transition and remove items and labels related to week overview
   */
  removeWeekOverview() {
    this.items.selectAll('.item-block-week').selectAll('.item-block-rect')
      .transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .attr('x', (d, i) => {
        return (i % 2 === 0) ? -this.settings.width / 3 : this.settings.width / 3
      })
      .remove()
    this.labels.selectAll('.label-day').remove()
    this.labels.selectAll('.label-week').remove()
    this.hideBackButton()
  }


  /**
   * Transition and remove items and labels related to daily overview
   */
  removeDayOverview() {
    this.items.selectAll('.item-block')
      .transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .attr('x', (d, i) => {
        return (i % 2 === 0) ? -this.settings.width / 3 : this.settings.width / 3
      })
      .remove()
    this.labels.selectAll('.label-time').remove()
    this.labels.selectAll('.label-project').remove()
    this.hideBackButton()
  }


  /**
   * Helper function to hide the tooltip
   */
  hideTooltip() {
    this.tooltip.transition()
      .duration(this.settings.transition_duration / 2)
      .ease(d3.easeLinear)
      .style('opacity', 0)
  }


  /**
   * Helper function to hide the back button
   */
  hideBackButton() {
    this.buttons.selectAll('.button')
      .transition()
      .duration(this.settings.transition_duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .remove()
  }


  /**
   * Helper function to convert seconds to a human readable format
   * @param seconds Integer
   */
  formatTime(seconds) {
    let hours = Math.floor(seconds / 3600)
    let minutes = Math.floor((seconds - (hours * 3600)) / 60)
    let time = ''
    if (hours > 0) {
      time += hours === 1 ? '1 hour ' : hours + ' hours '
    }
    if (minutes > 0) {
      time += minutes === 1 ? '1 minute' : minutes + ' minutes'
    }
    if (hours === 0 && minutes === 0) {
      time = Math.round(seconds) + ' seconds'
    }
    return time
  }


  render() {
    return (
      <div id='calendar-heatmap'
        className={styles.calendarHeatmap}
        ref={elem => {this.container = elem}}>
      </div>
    )
  }
}


CalendarHeatmap.defaultProps = {
  data: [],
  overview: 'year',
  color: '#ff4500',
  handler: undefined,
}


export default CalendarHeatmap
