import React from 'react'

import moment from 'moment'
import * as d3 from 'd3'

class CalendarHeatmap extends React.Component {

  constructor(props) {
    super(props)

    // Settings
    this.gutter = 5
    this.item_gutter = 1
    this.width = 1000
    this.height = 200
    this.item_size = 10
    this.label_padding = 40
    this.max_block_height = 20
    this.transition_duration = 500
    this.tooltip_width = 250
    this.tooltip_padding = 15
  }

  render() {
    return (
      <div id="calendar-heatmap"></div>
    )
  }
}

export default CalendarHeatmap
