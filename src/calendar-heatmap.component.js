import React from 'react'

import moment from 'moment'
import * as d3 from 'd3'

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

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcDimensions)
  }

  createElements() {
    // Create svg element
    this.svg = d3.select('#calendar-heatmap')
      .append('svg')
      .attr('class', 'svg')

    // Create other svg elements
    this.items = svg.append('g')
    this.labels = svg.append('g')
    this.buttons = svg.append('g')

    // Add tooltip to the same element as main svg
    this.tooltip = d3.select('#calendar-heatmap')
      .append('div')
      .attr('class', 'heatmap-tooltip')
      .style('opacity', 0)

    this.calcDimensions()
  }

  // Calculate dimensions based on available width
  calcDimensions() {
    var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000)
    var colIndex = Math.trunc(dayIndex / 7)
    var numWeeks = colIndex + 1

    this.settings.width = container.offsetWidth < 1000 ? 1000 : container.offsetWidth
    this.settings.item_size = ((this.settings.width - this.settings.label_padding) / numWeeks - this.settings.gutter)
    this.settings.height = this.settings.label_padding + 7 * (this.settings.item_size + this.settings.gutter)
    this.attr('width', this.settings.width)
      .attr('height', this.settings.height)

    if ( !!this.data && !!this.data[0].summary ) {
      this.drawChart()
    }
  }

  parseData() {
    if ( !this.props.data ) { return }

    // Get daily summary if that was not provided
    if ( !this.props.data[0].summary ) {
      this.props.data.map(function(d) {
        var summary = d.details.reduce(function(uniques, project) {
          if (!uniques[project.name]) {
            uniques[project.name] = {
              'value': project.value
            }
          } else {
            uniques[project.name].value += project.value
          }
          return uniques
        }, {})
        var unsorted_summary = Object.keys(summary).map(function(key) {
          return {
            'name': key,
            'value': summary[key].value
          }
        })
        d.summary = unsorted_summary.sort(function(a, b) {
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
    var start = moment(this.props.data[0].date).startOf('year')
    var end = moment(this.props.data[this.props.data.length - 1].date).endOf('year')

    // Define array of years and total values
    var year_data = d3.timeYears(start, end).map(function(d) {
      var date = moment(d)
      return {
        'date': date,
        'total': this.props.data.reduce(function(prev, current) {
          if (moment(current.date).year() === date.year()) {
            prev += current.total
          }
          return prev
        }, 0),
        'summary': function() {
          var summary = this.props.data.reduce(function(summary, d) {
            if (moment(d.date).year() === date.year()) {
              for (var i = 0; i < d.summary.length; i++) {
                if (!summary[d.summary[i].name]) {
                  summary[d.summary[i].name] = {
                    'value': d.summary[i].value,
                  }
                } else {
                  summary[d.summary[i].name].value += d.summary[i].value
                }
              }
            }
            return summary
          }, {})
          var unsorted_summary = Object.keys(summary).map(function(key) {
            return {
              'name': key,
              'value': summary[key].value
            }
          })
          return unsorted_summary.sort(function(a, b) {
            return b.value - a.value
          })
        }(),
      }
    })

    // Calculate max value of all the years in the dataset
    var max_value = d3.max(year_data, function(d) {
      return d.total
    })

    // Define year labels and axis
    var year_labels = d3.timeYears(start, end).map(function(d) {
      return moment(d)
    })
    var yearScale = d3.scaleBand()
      .rangeRound([0, this.settings.width])
      .padding([0.05])
      .domain(year_labels.map(function(d) {
        return d.year()
      }))

    // Add month data items to the overview
    this.items.selectAll('.item-block-year').remove()
    var item_block = this.items.selectAll('.item-block-year')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-year')
      .attr('width', function() {
        return (this.settings.width - this.settings.label_padding) / year_labels.length - this.settings.gutter * 5
      })
      .attr('height', function() {
        return this.settings.height - this.settings.label_padding
      })
      .attr('transform', function(d) {
        return 'translate(' + yearScale(d.date.year()) + ',' + this.settings.tooltip_padding * 2 + ')'
      })
      .attr('fill', function(d) {
        var color = d3.scaleLinear()
          .range(['#ffffff', this.color || '#ff4500'])
          .domain([-0.15 * max_value, max_value])
        return color(d.total) || '#ff4500'
      })
      .on('click', function(d) {
        if (this.in_transition) { return }

        // Set in_transition flag
        this.in_transition = true

        // Set selected date to the one clicked on
        this.selected = d

        // Hide tooltip
        this.hideTooltip()

        // Remove all month overview related items and labels
        this.removeGlobalOverview()

        // Redraw the chart
        this.overview = 'year'
        this.drawChart()
      })
      .style('opacity', 0)
      .on('mouseover', function(d) {
        if (this.in_transition) { return }

        // Construct tooltip
        var tooltip_html = ''
        tooltip_html += '<div><span><strong>Total time tracked:</strong></span>'

        var sec = parseInt(d.total, 10)
        var days = Math.floor(sec / 86400)
        if (days > 0) {
          tooltip_html += '<span>' + (days === 1 ? '1 day' : days + ' days') + '</span></div>'
        }
        var hours = Math.floor((sec - (days * 86400)) / 3600)
        if (hours > 0) {
          if (days > 0) {
            tooltip_html += '<div><span></span><span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>'
          } else {
            tooltip_html += '<span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>'
          }
        }
        var minutes = Math.floor((sec - (days * 86400) - (hours * 3600)) / 60)
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
          for (var i = 0; i < d.summary.length; i++) {
            tooltip_html += '<div><span><strong>' + d.summary[i].name + '</strong></span>'
            tooltip_html += '<span>' + this.formatTime(d.summary[i].value) + '</span></div>'
          }
        } else {
          for (var i = 0; i < 5; i++) {
            tooltip_html += '<div><span><strong>' + d.summary[i].name + '</strong></span>'
            tooltip_html += '<span>' + this.formatTime(d.summary[i].value) + '</span></div>'
          }
          tooltip_html += '<br />'

          var other_projects_sum = 0
          for (var i = 5; i < d.summary.length; i++) {
            other_projects_sum = +d.summary[i].value
          }
          tooltip_html += '<div><span><strong>Other:</strong></span>'
          tooltip_html += '<span>' + this.formatTime(other_projects_sum) + '</span></div>'
        }

        // Calculate tooltip position
        var x = yearScale(d.date.year()) + this.settings.tooltip_padding * 2
        while (this.settings.width - x < (this.settings.tooltip_width + this.settings.tooltip_padding * 5)) {
          x -= 10
        }
        var y = this.settings.tooltip_padding * 3

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.settings.transition_duration / 2)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('mouseout', function() {
        if (this.in_transition) { return }
        this.hideTooltip()
      })
      .transition()
      .delay(function(d, i) {
        return this.settings.transition_duration * (i + 1) / 10
      })
      .duration(function() {
        return this.settings.transition_duration
      })
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .call(function(transition, callback) {
        if (transition.empty()) {
          callback()
        }
        var n = 0
        transition
          .each(function() {++n })
          .on('end', function() {
            if (!--n) {
              callback.apply(this, arguments)
            }
          })
      }, function() {
        this.in_transition = false
      })

    // Add year labels
    this.labels.selectAll('.label-year').remove()
    this.labels.selectAll('.label-year')
      .data(year_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-year')
      .attr('font-size', function() {
        return Math.floor(this.settings.label_padding / 3) + 'px'
      })
      .text(function(d) {
        return d.year()
      })
      .attr('x', function(d) {
        return yearScale(d.year())
      })
      .attr('y', this.settings.label_padding / 2)
      .on('mouseenter', function(year_label) {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', function(d) {
            return (moment(d.date).year() === year_label.year()) ? 1 : 0.1
          })
      })
      .on('mouseout', function() {
        if (this.in_transition) { return }

        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.settings.transition_duration)
          .ease(d3.easeLinear)
          .style('opacity', 1)
      })
      .on('click', function(d) {
        if (this.in_transition) { return }

        // Set in_transition flag
        this.in_transition = true

        // Set selected month to the one clicked on
        this.selected = d

        // Hide tooltip
        this.hideTooltip()

        // Remove all year overview related items and labels
        this.removeGlobalOverview()

        // Redraw the chart
        this.overview = 'year'
        this.drawChart()
      })
  }

  render() {
    return (
      <div id="calendar-heatmap"></div>
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
