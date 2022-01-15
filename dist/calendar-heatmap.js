(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("moment"), require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "moment", "d3"], factory);
	else if(typeof exports === 'object')
		exports["CalendarHeatmap"] = factory(require("react"), require("moment"), require("d3"));
	else
		root["CalendarHeatmap"] = factory(root["React"], root["moment"], root["d3"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__244__, __WEBPACK_EXTERNAL_MODULE__192__, __WEBPACK_EXTERNAL_MODULE__990__) {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 966:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(244);

var React = _interopRequireWildcard(_react);

var _moment = __webpack_require__(192);

var _moment2 = _interopRequireDefault(_moment);

var _d = __webpack_require__(990);

var d3 = _interopRequireWildcard(_d);

var _calendarHeatmap = __webpack_require__(804);

var _calendarHeatmap2 = _interopRequireDefault(_calendarHeatmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalendarHeatmap = function (_React$Component) {
  _inherits(CalendarHeatmap, _React$Component);

  function CalendarHeatmap(props) {
    _classCallCheck(this, CalendarHeatmap);

    var _this = _possibleConstructorReturn(this, (CalendarHeatmap.__proto__ || Object.getPrototypeOf(CalendarHeatmap)).call(this, props));

    _this.settings = {
      gutter: 5,
      item_gutter: 1,
      width: 1000,
      height: 200,
      item_size: 10,
      label_padding: 40,
      max_block_height: 20,
      transition_duration: 500,
      tooltip_width: 250,
      tooltip_padding: 15
    };

    _this.in_transition = false;
    _this.overview = _this.props.overview;
    _this.history = ['global'];
    _this.selected = {};

    _this.calcDimensions = _this.calcDimensions.bind(_this);
    return _this;
  }

  _createClass(CalendarHeatmap, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createElements();
      this.parseData();
      this.drawChart();

      window.addEventListener('resize', this.calcDimensions);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.parseData();
      this.drawChart();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.calcDimensions);
    }
  }, {
    key: 'createElements',
    value: function createElements() {
      // Create svg element
      this.svg = d3.select('#calendar-heatmap').append('svg').attr('class', 'svg');

      // Create other svg elements
      this.items = this.svg.append('g');
      this.labels = this.svg.append('g');
      this.buttons = this.svg.append('g');

      // Add tooltip to the same element as main svg
      this.tooltip = d3.select('#calendar-heatmap').append('div').attr('class', _calendarHeatmap2.default.heatmapTooltip).style('opacity', 0).style('pointer-events', 'none').style('position', 'absolute').style('z-index', 9999).style('width', '250px').style('max-width', '250px').style('overflow', 'hidden').style('padding', '15px').style('font-size', '12px').style('line-height', '14px').style('color', 'rgb(51, 51, 51)').style('background', 'rgba(255, 255, 255, 0.75)');

      this.calcDimensions();
    }

    // Calculate dimensions based on available width

  }, {
    key: 'calcDimensions',
    value: function calcDimensions() {
      var dayIndex = Math.round(((0, _moment2.default)() - (0, _moment2.default)().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;

      this.settings.width = this.container.offsetWidth < 1000 ? 1000 : this.container.offsetWidth;
      this.settings.item_size = (this.settings.width - this.settings.label_padding) / numWeeks - this.settings.gutter;
      this.settings.height = this.settings.label_padding + 7 * (this.settings.item_size + this.settings.gutter);
      this.svg.attr('width', this.settings.width).attr('height', this.settings.height);

      if (!!this.props.data && !!this.props.data[0].summary) {
        this.drawChart();
      }
    }
  }, {
    key: 'parseData',
    value: function parseData() {
      if (!this.props.data) {
        return;
      }

      // Get daily summary if that was not provided
      if (!this.props.data[0].summary) {
        this.props.data.map(function (d) {
          var summary = d.details.reduce(function (uniques, project) {
            if (!uniques[project.name]) {
              uniques[project.name] = {
                'value': project.value
              };
            } else {
              uniques[project.name].value += project.value;
            }
            return uniques;
          }, {});
          var unsorted_summary = Object.keys(summary).map(function (key) {
            return {
              'name': key,
              'value': summary[key].value
            };
          });
          d.summary = unsorted_summary.sort(function (a, b) {
            return b.value - a.value;
          });
          return d;
        });
      }
    }
  }, {
    key: 'drawChart',
    value: function drawChart() {
      if (this.overview === 'global') {
        this.drawGlobalOverview();
      } else if (this.overview === 'year') {
        this.drawYearOverview();
      } else if (this.overview === 'month') {
        this.drawMonthOverview();
      } else if (this.overview === 'week') {
        this.drawWeekOverview();
      } else if (this.overview === 'day') {
        this.drawDayOverview();
      }
    }

    /**
     * Draw global overview (multiple years)
     */

  }, {
    key: 'drawGlobalOverview',
    value: function drawGlobalOverview() {
      var _this2 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }

      // Define start and end of the dataset
      var start = (0, _moment2.default)(this.props.data[0].date).startOf('year');
      var end = (0, _moment2.default)(this.props.data[this.props.data.length - 1].date).endOf('year');

      // Define array of years and total values
      var year_data = d3.timeYears(start, end).map(function (d) {
        var date = (0, _moment2.default)(d);
        var getSummary = function getSummary() {
          var summary = _this2.props.data.reduce(function (summary, d) {
            if ((0, _moment2.default)(d.date).year() === date.year()) {
              d.summary.map(function (item) {
                if (!summary[item.name]) {
                  summary[item.name] = {
                    'value': item.value
                  };
                } else {
                  summary[item.name].value += item.value;
                }
              });
            }
            return summary;
          }, {});
          var unsorted_summary = Object.keys(summary).map(function (key) {
            return {
              'name': key,
              'value': summary[key].value
            };
          });
          return unsorted_summary.sort(function (a, b) {
            return b.value - a.value;
          });
        };
        return {
          'date': date,
          'total': _this2.props.data.reduce(function (prev, current) {
            if ((0, _moment2.default)(current.date).year() === date.year()) {
              prev += current.total;
            }
            return prev;
          }, 0),
          'summary': getSummary()
        };
      });

      // Calculate max value of all the years in the dataset
      var max_value = d3.max(year_data, function (d) {
        return d.total;
      });

      // Define year labels and axis
      var year_labels = d3.timeYears(start, end).map(function (d) {
        return (0, _moment2.default)(d);
      });
      var yearScale = d3.scaleBand().rangeRound([0, this.settings.width]).padding([0.05]).domain(year_labels.map(function (d) {
        return d.year();
      }));

      // Add global data items to the overview
      this.items.selectAll('.item-block-year').remove();
      var item_block = this.items.selectAll('.item-block-year').data(year_data).enter().append('rect').attr('class', 'item item-block-year').style('cursor', 'pointer').attr('width', function () {
        return (_this2.settings.width - _this2.settings.label_padding) / year_labels.length - _this2.settings.gutter * 5;
      }).attr('height', function () {
        return _this2.settings.height - _this2.settings.label_padding;
      }).attr('transform', function (d) {
        return 'translate(' + yearScale(d.date.year()) + ',' + _this2.settings.tooltip_padding * 2 + ')';
      }).attr('fill', function (d) {
        var color = d3.scaleLinear().range(['#ffffff', _this2.props.color]).domain([-0.15 * max_value, max_value]);
        return color(d.total) || '#ff4500';
      }).on('click', function (d) {
        if (_this2.in_transition) {
          return;
        }

        // Set in_transition flag
        _this2.in_transition = true;

        // Set selected date to the one clicked on
        _this2.selected = d;

        // Hide tooltip
        _this2.hideTooltip();

        // Remove all global overview related items and labels
        _this2.removeGlobalOverview();

        // Redraw the chart
        _this2.overview = 'year';
        _this2.drawChart();
      }).style('opacity', 0).on('mouseover', function (event, d) {
        if (_this2.in_transition) {
          return;
        }

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div><span><strong>Total time tracked:</strong></span>';

        var sec = parseInt(d.total, 10);
        var days = Math.floor(sec / 86400);
        if (days > 0) {
          tooltip_html += '<span>' + (days === 1 ? '1 day' : days + ' days') + '</span></div>';
        }
        var hours = Math.floor((sec - days * 86400) / 3600);
        if (hours > 0) {
          if (days > 0) {
            tooltip_html += '<div><span></span><span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
          } else {
            tooltip_html += '<span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
          }
        }
        var minutes = Math.floor((sec - days * 86400 - hours * 3600) / 60);
        if (minutes > 0) {
          if (days > 0 || hours > 0) {
            tooltip_html += '<div><span></span><span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
          } else {
            tooltip_html += '<span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
          }
        }
        tooltip_html += '<br />';

        // Add summary to the tooltip
        if (d.summary.length <= 5) {
          var counter = 0;
          while (counter < d.summary.length) {
            tooltip_html += '<div><span><strong>' + d.summary[counter].name + '</strong></span>';
            tooltip_html += '<span>' + _this2.formatTime(d.summary[counter].value) + '</span></div>';
            counter++;
          }
        } else {
          var _counter = 0;
          while (_counter < 5) {
            tooltip_html += '<div><span><strong>' + d.summary[_counter].name + '</strong></span>';
            tooltip_html += '<span>' + _this2.formatTime(d.summary[_counter].value) + '</span></div>';
            _counter++;
          }

          tooltip_html += '<br />';

          _counter = 5;
          var other_projects_sum = 0;
          while (_counter < d.summary.length) {
            other_projects_sum = +d.summary[_counter].value;
            _counter++;
          }
          tooltip_html += '<div><span><strong>Other:</strong></span>';
          tooltip_html += '<span>' + _this2.formatTime(other_projects_sum) + '</span></div>';
        }

        // Calculate tooltip position
        var x = yearScale(d.date.year()) + _this2.settings.tooltip_padding * 2;
        while (_this2.settings.width - x < _this2.settings.tooltip_width + _this2.settings.tooltip_padding * 5) {
          x -= 10;
        }
        var y = _this2.settings.tooltip_padding * 3;

        // Show tooltip
        _this2.tooltip.html(tooltip_html).style('left', x + 'px').style('top', y + 'px').transition().duration(_this2.settings.transition_duration / 2).ease(d3.easeLinear).style('opacity', 1);
      }).on('mouseout', function () {
        if (_this2.in_transition) {
          return;
        }
        _this2.hideTooltip();
      }).transition().delay(function (d, i) {
        return _this2.settings.transition_duration * (i + 1) / 10;
      }).duration(function () {
        return _this2.settings.transition_duration;
      }).ease(d3.easeLinear).style('opacity', 1).call(function (transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition.each(function () {
          ++n;
        }).on('end', function () {
          if (! --n) {
            callback.apply(this, arguments);
          }
        });
      }, function () {
        _this2.in_transition = false;
      });

      // Add year labels
      this.labels.selectAll('.label-year').remove();
      this.labels.selectAll('.label-year').data(year_labels).enter().append('text').attr('class', 'label label-year').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this2.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return d.year();
      }).attr('x', function (d) {
        return yearScale(d.year());
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, year_label) {
        if (_this2.in_transition) {
          return;
        }

        _this2.items.selectAll('.item-block-year').transition().duration(_this2.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).year() === year_label.year() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this2.in_transition) {
          return;
        }

        _this2.items.selectAll('.item-block-year').transition().duration(_this2.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      }).on('click', function (event, d) {
        if (_this2.in_transition) {
          return;
        }

        // Set in_transition flag
        _this2.in_transition = true;

        // Set selected year to the one clicked on
        _this2.selected = { date: d

          // Hide tooltip
        };_this2.hideTooltip();

        // Remove all global overview related items and labels
        _this2.removeGlobalOverview();

        // Redraw the chart
        _this2.overview = 'year';
        _this2.drawChart();
      });
    }

    /**
     * Draw year overview
     */

  }, {
    key: 'drawYearOverview',
    value: function drawYearOverview() {
      var _this3 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }

      // Define start and end date of the selected year
      var start_of_year = (0, _moment2.default)(this.selected.date).startOf('year');
      var end_of_year = (0, _moment2.default)(this.selected.date).endOf('year');

      // Filter data down to the selected year
      var year_data = this.props.data.filter(function (d) {
        return start_of_year <= (0, _moment2.default)(d.date) && (0, _moment2.default)(d.date) < end_of_year;
      });

      // Calculate max value of the year data
      var max_value = d3.max(year_data, function (d) {
        return d.total;
      });

      var color = d3.scaleLinear().range(['#ffffff', this.props.color]).domain([-0.15 * max_value, max_value]);

      var calcItemX = function calcItemX(d) {
        var date = (0, _moment2.default)(d.date);
        var dayIndex = Math.round((date - (0, _moment2.default)(start_of_year).startOf('week')) / 86400000);
        var colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (_this3.settings.item_size + _this3.settings.gutter) + _this3.settings.label_padding;
      };

      var calcItemY = function calcItemY(d) {
        return _this3.settings.label_padding + (0, _moment2.default)(d.date).weekday() * (_this3.settings.item_size + _this3.settings.gutter);
      };

      var calcItemSize = function calcItemSize(d) {
        if (max_value <= 0) {
          return _this3.settings.item_size;
        }
        return _this3.settings.item_size * 0.75 + _this3.settings.item_size * d.total / max_value * 0.25;
      };

      this.items.selectAll('.item-circle').remove();
      this.items.selectAll('.item-circle').data(year_data).enter().append('rect').attr('class', 'item item-circle').style('cursor', 'pointer').style('opacity', 0).attr('x', function (d) {
        return calcItemX(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
      }).attr('y', function (d) {
        return calcItemY(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
      }).attr('rx', function (d) {
        return calcItemSize(d);
      }).attr('ry', function (d) {
        return calcItemSize(d);
      }).attr('width', function (d) {
        return calcItemSize(d);
      }).attr('height', function (d) {
        return calcItemSize(d);
      }).attr('fill', function (d) {
        return d.total > 0 ? color(d.total) : 'transparent';
      }).on('click', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }

        _this3.in_transition = true;

        // Set selected date to the one clicked on
        _this3.selected = d;

        // Hide tooltip
        _this3.hideTooltip();

        // Remove all year overview related items and labels
        _this3.removeYearOverview();

        // Redraw the chart
        _this3.overview = 'day';
        _this3.drawChart();
      }).on('mouseover', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        // Pulsating animation
        var circle = d3.select(event.currentTarget);
        var repeat = function repeat() {
          circle = circle.transition().duration(_this3.settings.transition_duration).ease(d3.easeLinear).attr('x', function (d) {
            return calcItemX(d) - (_this3.settings.item_size * 1.1 - _this3.settings.item_size) / 2;
          }).attr('y', function (d) {
            return calcItemY(d) - (_this3.settings.item_size * 1.1 - _this3.settings.item_size) / 2;
          }).attr('width', _this3.settings.item_size * 1.1).attr('height', _this3.settings.item_size * 1.1).transition().duration(_this3.settings.transition_duration).ease(d3.easeLinear).attr('x', function (d) {
            return calcItemX(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
          }).attr('y', function (d) {
            return calcItemY(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
          }).attr('width', function (d) {
            return calcItemSize(d);
          }).attr('height', function (d) {
            return calcItemSize(d);
          }).on('end', repeat);
        };
        repeat();

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="' + _calendarHeatmap2.default.header + '"><strong>' + (d.total ? _this3.formatTime(d.total) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + (0, _moment2.default)(d.date).format('dddd, MMM Do YYYY') + '</div><br>';

        // Add summary to the tooltip
        var counter = 0;
        while (counter < d.summary.length) {
          tooltip_html += '<div><span><strong>' + d.summary[counter].name + '</strong></span>';
          tooltip_html += '<span>' + _this3.formatTime(d.summary[counter].value) + '</span></div>';
          counter++;
        }

        // Calculate tooltip position
        var x = calcItemX(d) + _this3.settings.item_size;
        if (_this3.settings.width - x < _this3.settings.tooltip_width + _this3.settings.tooltip_padding * 3) {
          x -= _this3.settings.tooltip_width + _this3.settings.tooltip_padding * 2;
        }
        var y = calcItemY(d) + _this3.settings.item_size;

        // Show tooltip
        _this3.tooltip.html(tooltip_html).style('left', x + 'px').style('top', y + 'px').transition().duration(_this3.settings.transition_duration / 2).ease(d3.easeLinear).style('opacity', 1);
      }).on('mouseout', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        // Set circle radius back to what its supposed to be
        d3.select(event.currentTarget).transition().duration(_this3.settings.transition_duration / 2).ease(d3.easeLinear).attr('x', function (d) {
          return calcItemX(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
        }).attr('y', function (d) {
          return calcItemY(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
        }).attr('width', function (d) {
          return calcItemSize(d);
        }).attr('height', function (d) {
          return calcItemSize(d);
        });

        // Hide tooltip
        _this3.hideTooltip();
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this3.settings.transition_duration;
      }).duration(function () {
        return _this3.settings.transition_duration;
      }).ease(d3.easeLinear).style('opacity', 1).call(function (transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition.each(function () {
          return ++n;
        }).on('end', function () {
          if (! --n) {
            callback.apply(this, arguments);
          }
        });
      }, function () {
        _this3.in_transition = false;
      });

      // Add month labels
      var month_labels = d3.timeMonths(start_of_year, end_of_year);
      var monthScale = d3.scaleLinear().range([0, this.settings.width]).domain([0, month_labels.length]);
      this.labels.selectAll('.label-month').remove();
      this.labels.selectAll('.label-month').data(month_labels).enter().append('text').attr('class', 'label label-month').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this3.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return d.toLocaleDateString('en-us', { month: 'short' });
      }).attr('x', function (d, i) {
        return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2;
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        var selected_month = (0, _moment2.default)(d);
        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this3.in_transition) {
          return;
        }

        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      }).on('click', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        // Check month data
        var month_data = _this3.props.data.filter(function (e) {
          return (0, _moment2.default)(d).startOf('month') <= (0, _moment2.default)(e.date) && (0, _moment2.default)(e.date) < (0, _moment2.default)(d).endOf('month');
        });

        // Don't transition if there is no data to show
        if (!month_data.length) {
          return;
        }

        // Set selected month to the one clicked on
        _this3.selected = { date: d };

        _this3.in_transition = true;

        // Hide tooltip
        _this3.hideTooltip();

        // Remove all year overview related items and labels
        _this3.removeYearOverview();

        // Redraw the chart
        _this3.overview = 'month';
        _this3.drawChart();
      });

      // Add day labels
      var day_labels = d3.timeDays((0, _moment2.default)().startOf('week'), (0, _moment2.default)().endOf('week'));
      var dayScale = d3.scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(day_labels.map(function (d) {
        return (0, _moment2.default)(d).weekday();
      }));
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day').data(day_labels).enter().append('text').attr('class', 'label label-day').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 3).attr('y', function (d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this3.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return (0, _moment2.default)(d).format('dddd')[0];
      }).on('mouseenter', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        var selected_day = (0, _moment2.default)(d);
        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).day() === selected_day.day() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this3.in_transition) {
          return;
        }

        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      });

      // Add button to switch back to previous overview
      this.drawButton();
    }

    /**
     * Draw month overview
     */

  }, {
    key: 'drawMonthOverview',
    value: function drawMonthOverview() {
      var _this4 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }

      // Define beginning and end of the month
      var start_of_month = (0, _moment2.default)(this.selected.date).startOf('month');
      var end_of_month = (0, _moment2.default)(this.selected.date).endOf('month');

      // Filter data down to the selected month
      var month_data = this.props.data.filter(function (d) {
        return start_of_month <= (0, _moment2.default)(d.date) && (0, _moment2.default)(d.date) < end_of_month;
      });
      var max_value = d3.max(month_data, function (d) {
        return d3.max(d.summary, function (d) {
          return d.value;
        });
      });

      // Define day labels and axis
      var day_labels = d3.timeDays((0, _moment2.default)().startOf('week'), (0, _moment2.default)().endOf('week'));
      var dayScale = d3.scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(day_labels.map(function (d) {
        return (0, _moment2.default)(d).weekday();
      }));

      // Define week labels and axis
      var week_labels = [start_of_month.clone()];
      while (start_of_month.week() !== end_of_month.week()) {
        week_labels.push(start_of_month.add(1, 'week').clone());
      }
      var weekScale = d3.scaleBand().rangeRound([this.settings.label_padding, this.settings.width]).padding([0.05]).domain(week_labels.map(function (weekday) {
        return weekday.week();
      }));

      // Add month data items to the overview
      this.items.selectAll('.item-block-month').remove();
      var item_block = this.items.selectAll('.item-block-month').data(month_data).enter().append('g').attr('class', 'item item-block-month').style('cursor', 'pointer').attr('width', function () {
        return (_this4.settings.width - _this4.settings.label_padding) / week_labels.length - _this4.settings.gutter * 5;
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this4.settings.max_block_height);
      }).attr('transform', function (d) {
        return 'translate(' + weekScale((0, _moment2.default)(d.date).week()) + ',' + (dayScale((0, _moment2.default)(d.date).weekday()) + dayScale.bandwidth() / 1.75 - 15) + ')';
      }).attr('total', function (d) {
        return d.total;
      }).attr('date', function (d) {
        return d.date;
      }).attr('offset', 0).on('click', function (event, d) {
        if (_this4.in_transition) {
          return;
        }

        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }

        _this4.in_transition = true;

        // Set selected date to the one clicked on
        _this4.selected = d;

        // Hide tooltip
        _this4.hideTooltip();

        // Remove all month overview related items and labels
        _this4.removeMonthOverview();

        // Redraw the chart
        _this4.overview = 'day';
        _this4.drawChart();
      });

      var item_width = (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5;
      var itemScale = d3.scaleLinear().rangeRound([0, item_width]);

      var item_gutter = this.settings.item_gutter;
      item_block.selectAll('.item-block-rect').data(function (d) {
        return d.summary;
      }).enter().append('rect').attr('class', 'item item-block-rect').style('cursor', 'pointer').attr('x', function (d) {
        var total = parseInt(d3.select(this.parentNode).attr('total'));
        var offset = parseInt(d3.select(this.parentNode).attr('offset'));
        itemScale.domain([0, total]);
        d3.select(this.parentNode).attr('offset', offset + itemScale(d.value));
        return offset;
      }).attr('width', function (d) {
        var total = parseInt(d3.select(this.parentNode).attr('total'));
        itemScale.domain([0, total]);
        return Math.max(itemScale(d.value) - item_gutter, 1);
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this4.settings.max_block_height);
      }).attr('fill', function (d) {
        var color = d3.scaleLinear().range(['#ffffff', _this4.props.color]).domain([-0.15 * max_value, max_value]);
        return color(d.value) || '#ff4500';
      }).style('opacity', 0).on('mouseover', function (event, d) {
        if (_this4.in_transition) {
          return;
        }

        // Get date from the parent node
        var parentNode = d3.select(event.currentTarget.parentNode);
        var date = new Date(parentNode.attr('date'));

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="' + _calendarHeatmap2.default.header + '"><strong>' + d.name + '</strong></div><br>';
        tooltip_html += '<div><strong>' + (d.value ? _this4.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + (0, _moment2.default)(date).format('dddd, MMM Do YYYY') + '</div>';

        // Calculate tooltip position
        var x = weekScale((0, _moment2.default)(date).week()) + _this4.settings.tooltip_padding;
        while (_this4.settings.width - x < _this4.settings.tooltip_width + _this4.settings.tooltip_padding * 3) {
          x -= 10;
        }
        var y = dayScale((0, _moment2.default)(date).weekday()) + _this4.settings.tooltip_padding * 2;

        // Show tooltip
        _this4.tooltip.html(tooltip_html).style('left', x + 'px').style('top', y + 'px').transition().duration(_this4.settings.transition_duration / 2).ease(d3.easeLinear).style('opacity', 1);
      }).on('mouseout', function () {
        if (_this4.in_transition) {
          return;
        }
        _this4.hideTooltip();
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this4.settings.transition_duration;
      }).duration(function () {
        return _this4.settings.transition_duration;
      }).ease(d3.easeLinear).style('opacity', 1).call(function (transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition.each(function () {
          return ++n;
        }).on('end', function () {
          if (! --n) {
            callback.apply(this, arguments);
          }
        });
      }, function () {
        _this4.in_transition = false;
      });

      // Add week labels
      this.labels.selectAll('.label-week').remove();
      this.labels.selectAll('.label-week').data(week_labels).enter().append('text').attr('class', 'label label-week').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this4.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return 'Week ' + d.week();
      }).attr('x', function (d) {
        return weekScale(d.week());
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, weekday) {
        if (_this4.in_transition) {
          return;
        }

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).week() === weekday.week() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this4.in_transition) {
          return;
        }

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      }).on('click', function (event, d) {
        if (_this4.in_transition) {
          return;
        }

        // Check week data
        var week_data = _this4.props.data.filter(function (e) {
          return d.startOf('week') <= (0, _moment2.default)(e.date) && (0, _moment2.default)(e.date) < d.endOf('week');
        });

        // Don't transition if there is no data to show
        if (!week_data.length) {
          return;
        }

        _this4.in_transition = true;

        // Set selected month to the one clicked on
        _this4.selected = { date: d

          // Hide tooltip
        };_this4.hideTooltip();

        // Remove all year overview related items and labels
        _this4.removeMonthOverview();

        // Redraw the chart
        _this4.overview = 'week';
        _this4.drawChart();
      });

      // Add day labels
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day').data(day_labels).enter().append('text').attr('class', 'label label-day').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 3).attr('y', function (d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this4.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return (0, _moment2.default)(d).format('dddd')[0];
      }).on('mouseenter', function (event, d) {
        if (_this4.in_transition) {
          return;
        }

        var selected_day = (0, _moment2.default)(d);
        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).day() === selected_day.day() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this4.in_transition) {
          return;
        }

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      });

      // Add button to switch back to previous overview
      this.drawButton();
    }

    /**
     * Draw week overview
     */

  }, {
    key: 'drawWeekOverview',
    value: function drawWeekOverview() {
      var _this5 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }

      // Define beginning and end of the week
      var start_of_week = (0, _moment2.default)(this.selected.date).startOf('week');
      var end_of_week = (0, _moment2.default)(this.selected.date).endOf('week');

      // Filter data down to the selected week
      var week_data = this.props.data.filter(function (d) {
        return start_of_week <= (0, _moment2.default)(d.date) && (0, _moment2.default)(d.date) < end_of_week;
      });
      var max_value = d3.max(week_data, function (d) {
        return d3.max(d.summary, function (d) {
          return d.value;
        });
      });

      // Define day labels and axis
      var day_labels = d3.timeDays((0, _moment2.default)().startOf('week'), (0, _moment2.default)().endOf('week'));
      var dayScale = d3.scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(day_labels.map(function (d) {
        return (0, _moment2.default)(d).weekday();
      }));

      // Define week labels and axis
      var week_labels = [start_of_week];
      var weekScale = d3.scaleBand().rangeRound([this.settings.label_padding, this.settings.width]).padding([0.01]).domain(week_labels.map(function (weekday) {
        return weekday.week();
      }));

      // Add week data items to the overview
      this.items.selectAll('.item-block-week').remove();
      var item_block = this.items.selectAll('.item-block-week').data(week_data).enter().append('g').attr('class', 'item item-block-week').style('cursor', 'pointer').attr('width', function () {
        return (_this5.settings.width - _this5.settings.label_padding) / week_labels.length - _this5.settings.gutter * 5;
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this5.settings.max_block_height);
      }).attr('transform', function (d) {
        return 'translate(' + weekScale((0, _moment2.default)(d.date).week()) + ',' + (dayScale((0, _moment2.default)(d.date).weekday()) + dayScale.bandwidth() / 1.75 - 15) + ')';
      }).attr('total', function (d) {
        return d.total;
      }).attr('date', function (d) {
        return d.date;
      }).attr('offset', 0).on('click', function (event, d) {
        if (_this5.in_transition) {
          return;
        }

        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }

        _this5.in_transition = true;

        // Set selected date to the one clicked on
        _this5.selected = d;

        // Hide tooltip
        _this5.hideTooltip();

        // Remove all week overview related items and labels
        _this5.removeWeekOverview();

        // Redraw the chart
        _this5.overview = 'day';
        _this5.drawChart();
      });

      var item_width = (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5;
      var itemScale = d3.scaleLinear().rangeRound([0, item_width]);

      var item_gutter = this.settings.item_gutter;
      item_block.selectAll('.item-block-rect').data(function (d) {
        return d.summary;
      }).enter().append('rect').attr('class', 'item item-block-rect').style('cursor', 'pointer').attr('x', function (d) {
        var total = parseInt(d3.select(this.parentNode).attr('total'));
        var offset = parseInt(d3.select(this.parentNode).attr('offset'));
        itemScale.domain([0, total]);
        d3.select(this.parentNode).attr('offset', offset + itemScale(d.value));
        return offset;
      }).attr('width', function (d) {
        var total = parseInt(d3.select(this.parentNode).attr('total'));
        itemScale.domain([0, total]);
        return Math.max(itemScale(d.value) - item_gutter, 1);
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this5.settings.max_block_height);
      }).attr('fill', function (d) {
        var color = d3.scaleLinear().range(['#ffffff', _this5.props.color]).domain([-0.15 * max_value, max_value]);
        return color(d.value) || '#ff4500';
      }).style('opacity', 0).on('mouseover', function (event, d) {
        if (_this5.in_transition) {
          return;
        }

        // Get date from the parent node
        var parentNode = d3.select(event.currentTarget.parentNode);
        var date = new Date(parentNode.attr('date'));

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="' + _calendarHeatmap2.default.header + '"><strong>' + d.name + '</strong></div><br>';
        tooltip_html += '<div><strong>' + (d.value ? _this5.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + (0, _moment2.default)(date).format('dddd, MMM Do YYYY') + '</div>';

        // Calculate tooltip position
        var total = parseInt(parentNode.attr('total'));
        itemScale.domain([0, total]);
        var x = parseInt(d3.select(event.currentTarget).attr('x')) + itemScale(d.value) / 4 + _this5.settings.tooltip_width / 4;
        while (_this5.settings.width - x < _this5.settings.tooltip_width + _this5.settings.tooltip_padding * 3) {
          x -= 10;
        }
        var y = dayScale((0, _moment2.default)(date).weekday()) + _this5.settings.tooltip_padding * 1.5;

        // Show tooltip
        _this5.tooltip.html(tooltip_html).style('left', x + 'px').style('top', y + 'px').transition().duration(_this5.settings.transition_duration / 2).ease(d3.easeLinear).style('opacity', 1);
      }).on('mouseout', function () {
        if (_this5.in_transition) {
          return;
        }
        _this5.hideTooltip();
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this5.settings.transition_duration;
      }).duration(function () {
        return _this5.settings.transition_duration;
      }).ease(d3.easeLinear).style('opacity', 1).call(function (transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition.each(function () {
          return ++n;
        }).on('end', function () {
          if (! --n) {
            callback.apply(this, arguments);
          }
        });
      }, function () {
        _this5.in_transition = false;
      });

      // Add week labels
      this.labels.selectAll('.label-week').remove();
      this.labels.selectAll('.label-week').data(week_labels).enter().append('text').attr('class', 'label label-week').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this5.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return 'Week ' + d.week();
      }).attr('x', function (d) {
        return weekScale(d.week());
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, weekday) {
        if (_this5.in_transition) {
          return;
        }

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).week() === weekday.week() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this5.in_transition) {
          return;
        }

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      });

      // Add day labels
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day').data(day_labels).enter().append('text').attr('class', 'label label-day').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 3).attr('y', function (d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this5.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return (0, _moment2.default)(d).format('dddd')[0];
      }).on('mouseenter', function (event, d) {
        if (_this5.in_transition) {
          return;
        }

        var selected_day = (0, _moment2.default)(d);
        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return (0, _moment2.default)(d.date).day() === selected_day.day() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this5.in_transition) {
          return;
        }

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
      });

      // Add button to switch back to previous overview
      this.drawButton();
    }

    /**
     * Draw day overview
     */

  }, {
    key: 'drawDayOverview',
    value: function drawDayOverview() {
      var _this6 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }

      // Initialize selected date to today if it was not set
      if (!Object.keys(this.selected).length) {
        this.selected = this.props.data[this.props.data.length - 1];
      }

      var project_labels = this.selected.summary.map(function (project) {
        return project.name;
      });
      var projectScale = d3.scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(project_labels);

      var itemScale = d3.scaleTime().range([this.settings.label_padding * 2, this.settings.width]).domain([(0, _moment2.default)(this.selected.date).startOf('day'), (0, _moment2.default)(this.selected.date).endOf('day')]);
      this.items.selectAll('.item-block').remove();
      this.items.selectAll('.item-block').data(this.selected.details).enter().append('rect').attr('class', 'item item-block').style('cursor', 'pointer').attr('x', function (d) {
        return itemScale((0, _moment2.default)(d.date));
      }).attr('y', function (d) {
        return projectScale(d.name) + projectScale.bandwidth() / 2 - 15;
      }).attr('width', function (d) {
        var end = itemScale(d3.timeSecond.offset((0, _moment2.default)(d.date), d.value));
        return Math.max(end - itemScale((0, _moment2.default)(d.date)), 1);
      }).attr('height', function () {
        return Math.min(projectScale.bandwidth(), _this6.settings.max_block_height);
      }).attr('fill', function () {
        return _this6.props.color;
      }).style('opacity', 0).on('mouseover', function (event, d) {
        if (_this6.in_transition) {
          return;
        }

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="' + _calendarHeatmap2.default.header + '"><strong>' + d.name + '</strong><div><br>';
        tooltip_html += '<div><strong>' + (d.value ? _this6.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + (0, _moment2.default)(d.date).format('dddd, MMM Do YYYY HH:mm') + '</div>';

        // Calculate tooltip position
        var x = d.value * 100 / (60 * 60 * 24) + itemScale((0, _moment2.default)(d.date));
        while (_this6.settings.width - x < _this6.settings.tooltip_width + _this6.settings.tooltip_padding * 3) {
          x -= 10;
        }
        var y = projectScale(d.name) + projectScale.bandwidth() / 2 + _this6.settings.tooltip_padding / 2;

        // Show tooltip
        _this6.tooltip.html(tooltip_html).style('left', x + 'px').style('top', y + 'px').transition().duration(_this6.settings.transition_duration / 2).ease(d3.easeLinear).style('opacity', 1);
      }).on('mouseout', function () {
        if (_this6.in_transition) {
          return;
        }
        _this6.hideTooltip();
      }).on('click', function (event, d) {
        if (!!_this6.props.handler && typeof _this6.props.handler == 'function') {
          _this6.props.handler(d);
        }
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this6.settings.transition_duration;
      }).duration(function () {
        return _this6.settings.transition_duration;
      }).ease(d3.easeLinear).style('opacity', 0.5).call(function (transition, callback) {
        if (transition.empty()) {
          callback();
        }
        var n = 0;
        transition.each(function () {
          return ++n;
        }).on('end', function () {
          if (! --n) {
            callback.apply(this, arguments);
          }
        });
      }, function () {
        _this6.in_transition = false;
      });

      // Add time labels
      var timeLabels = d3.timeHours((0, _moment2.default)(this.selected.date).startOf('day'), (0, _moment2.default)(this.selected.date).endOf('day'));
      var timeScale = d3.scaleTime().range([this.settings.label_padding * 2, this.settings.width]).domain([0, timeLabels.length]);
      this.labels.selectAll('.label-time').remove();
      this.labels.selectAll('.label-time').data(timeLabels).enter().append('text').attr('class', 'label label-time').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this6.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return (0, _moment2.default)(d).format('HH:mm');
      }).attr('x', function (d, i) {
        return timeScale(i);
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, d) {
        if (_this6.in_transition) {
          return;
        }

        var selected = itemScale((0, _moment2.default)(d));
        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          var start = itemScale((0, _moment2.default)(d.date));
          var end = itemScale((0, _moment2.default)(d.date).add(d.value, 'seconds'));
          return selected >= start && selected <= end ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this6.in_transition) {
          return;
        }

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0.5);
      });

      // Add project labels
      var label_padding = this.settings.label_padding;
      this.labels.selectAll('.label-project').remove();
      this.labels.selectAll('.label-project').data(project_labels).enter().append('text').attr('class', 'label label-project').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.gutter).attr('y', function (d) {
        return projectScale(d) + projectScale.bandwidth() / 2;
      }).attr('min-height', function () {
        return projectScale.bandwidth();
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this6.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return d;
      }).each(function () {
        var obj = d3.select(this),
            text_length = obj.node().getComputedTextLength(),
            text = obj.text();
        while (text_length > label_padding * 1.5 && text.length > 0) {
          text = text.slice(0, -1);
          obj.text(text + '...');
          text_length = obj.node().getComputedTextLength();
        }
      }).on('mouseenter', function (event, project) {
        if (_this6.in_transition) {
          return;
        }

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(d3.easeLinear).style('opacity', function (d) {
          return d.name === project ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this6.in_transition) {
          return;
        }

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0.5);
      });

      // Add button to switch back to previous overview
      this.drawButton();
    }

    /**
     * Draw the button for navigation purposes
     */

  }, {
    key: 'drawButton',
    value: function drawButton() {
      var _this7 = this;

      this.buttons.selectAll('.button').remove();
      var button = this.buttons.append('g').attr('class', 'button button-back').style('cursor', 'pointer').attr('fill', 'transparent').style('opacity', 0).style('stroke-width', 2).style('stroke', 'rgb(170, 170, 170)').on('click', function () {
        if (_this7.in_transition) {
          return;
        }

        // Set transition boolean
        _this7.in_transition = true;

        // Clean the canvas from whichever overview type was on
        if (_this7.overview === 'year') {
          _this7.removeYearOverview();
        } else if (_this7.overview === 'month') {
          _this7.removeMonthOverview();
        } else if (_this7.overview === 'week') {
          _this7.removeWeekOverview();
        } else if (_this7.overview === 'day') {
          _this7.removeDayOverview();
        }

        // Redraw the chart
        _this7.history.pop();
        _this7.overview = _this7.history.pop();
        _this7.drawChart();
      });
      button.append('circle').attr('cx', this.settings.label_padding / 2.25).attr('cy', this.settings.label_padding / 2.5).attr('r', this.settings.item_size / 2);
      button.append('text').style('stroke-width', 1).style('text-anchor', 'middle').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 2.25).attr('y', this.settings.label_padding / 2.5).attr('dy', function () {
        return Math.floor(_this7.settings.width / 100) / 3;
      }).attr('font-size', function () {
        return Math.floor(_this7.settings.label_padding / 3) + 'px';
      }).html('&#x2190');
      button.transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 1);
    }

    /**
     * Transition and remove items and labels related to global overview
     */

  }, {
    key: 'removeGlobalOverview',
    value: function removeGlobalOverview() {
      this.items.selectAll('.item-block-year').transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0).remove();
      this.labels.selectAll('.label-year').remove();
    }

    /**
     * Transition and remove items and labels related to year overview
     */

  }, {
    key: 'removeYearOverview',
    value: function removeYearOverview() {
      this.items.selectAll('.item-circle').transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0).remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-month').remove();
      this.hideBackButton();
    }

    /**
     * Transition and remove items and labels related to month overview
     */

  }, {
    key: 'removeMonthOverview',
    value: function removeMonthOverview() {
      var _this8 = this;

      this.items.selectAll('.item-block-month').selectAll('.item-block-rect').transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0).attr('x', function (d, i) {
        return i % 2 === 0 ? -_this8.settings.width / 3 : _this8.settings.width / 3;
      }).remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-week').remove();
      this.hideBackButton();
    }

    /**
     * Transition and remove items and labels related to week overview
     */

  }, {
    key: 'removeWeekOverview',
    value: function removeWeekOverview() {
      var _this9 = this;

      this.items.selectAll('.item-block-week').selectAll('.item-block-rect').transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0).attr('x', function (d, i) {
        return i % 2 === 0 ? -_this9.settings.width / 3 : _this9.settings.width / 3;
      }).remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-week').remove();
      this.hideBackButton();
    }

    /**
     * Transition and remove items and labels related to daily overview
     */

  }, {
    key: 'removeDayOverview',
    value: function removeDayOverview() {
      var _this10 = this;

      this.items.selectAll('.item-block').transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0).attr('x', function (d, i) {
        return i % 2 === 0 ? -_this10.settings.width / 3 : _this10.settings.width / 3;
      }).remove();
      this.labels.selectAll('.label-time').remove();
      this.labels.selectAll('.label-project').remove();
      this.hideBackButton();
    }

    /**
     * Helper function to hide the tooltip
     */

  }, {
    key: 'hideTooltip',
    value: function hideTooltip() {
      this.tooltip.transition().duration(this.settings.transition_duration / 2).ease(d3.easeLinear).style('opacity', 0);
    }

    /**
     * Helper function to hide the back button
     */

  }, {
    key: 'hideBackButton',
    value: function hideBackButton() {
      this.buttons.selectAll('.button').transition().duration(this.settings.transition_duration).ease(d3.easeLinear).style('opacity', 0).remove();
    }

    /**
     * Helper function to convert seconds to a human readable format
     * @param seconds Integer
     */

  }, {
    key: 'formatTime',
    value: function formatTime(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds - hours * 3600) / 60);
      var time = '';
      if (hours > 0) {
        time += hours === 1 ? '1 hour ' : hours + ' hours ';
      }
      if (minutes > 0) {
        time += minutes === 1 ? '1 minute' : minutes + ' minutes';
      }
      if (hours === 0 && minutes === 0) {
        time = Math.round(seconds) + ' seconds';
      }
      return time;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this11 = this;

      return React.createElement('div', { id: 'calendar-heatmap',
        className: _calendarHeatmap2.default.calendarHeatmap,
        ref: function ref(elem) {
          _this11.container = elem;
        } });
    }
  }]);

  return CalendarHeatmap;
}(React.Component);

CalendarHeatmap.defaultProps = {
  data: [],
  overview: 'year',
  color: '#ff4500',
  handler: undefined
};

exports["default"] = CalendarHeatmap;
module.exports = exports['default'];

/***/ }),

/***/ 352:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _calendarHeatmapComponent = __webpack_require__(966);

var _calendarHeatmapComponent2 = _interopRequireDefault(_calendarHeatmapComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = _calendarHeatmapComponent2.default;
module.exports = exports['default'];

/***/ }),

/***/ 434:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(537);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".calendarHeatmap {\n  font-family: Helvetica, Arial, sans-serif;\n  user-select: none;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n}\n.calendarHeatmap .heatmapTooltip {\n  pointer-events: none;\n  position: absolute;\n  z-index: 9999;\n  width: 250px;\n  max-width: 250px;\n  overflow: hidden;\n  padding: 15px;\n  font-size: 12px;\n  text-align: left;\n  line-height: 14px;\n  color: rgb(51, 51, 51);\n  font-family: Helvetica, arial, 'Open Sans', sans-serif;\n  background: rgba(255, 255, 255, 0.75);\n}\n.calendarHeatmap .heatmapTooltip .header strong {\n  display: inline-block;\n  width: 250px;\n}\n.calendarHeatmap .heatmapTooltip span {\n  display: inline-block;\n  width: 50%;\n  padding-right: 10px;\n  box-sizing: border-box;\n}\n.calendarHeatmap .heatmapTooltip span,\n.calendarHeatmap .heatmapTooltip .header strong {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n", "",{"version":3,"sources":["webpack://./src/calendar-heatmap.css"],"names":[],"mappings":"AAAA;EACE,yCAAyC;EACzC,iBAAiB;EACjB,qBAAqB;EACrB,sBAAsB;EACtB,yBAAyB;AAC3B;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,YAAY;EACZ,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;EACb,eAAe;EACf,gBAAgB;EAChB,iBAAiB;EACjB,sBAAsB;EACtB,sDAAsD;EACtD,qCAAqC;AACvC;AACA;EACE,qBAAqB;EACrB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,UAAU;EACV,mBAAmB;EACnB,sBAAsB;AACxB;AACA;;EAEE,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB","sourcesContent":[".calendarHeatmap {\n  font-family: Helvetica, Arial, sans-serif;\n  user-select: none;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n}\n.calendarHeatmap .heatmapTooltip {\n  pointer-events: none;\n  position: absolute;\n  z-index: 9999;\n  width: 250px;\n  max-width: 250px;\n  overflow: hidden;\n  padding: 15px;\n  font-size: 12px;\n  text-align: left;\n  line-height: 14px;\n  color: rgb(51, 51, 51);\n  font-family: Helvetica, arial, 'Open Sans', sans-serif;\n  background: rgba(255, 255, 255, 0.75);\n}\n.calendarHeatmap .heatmapTooltip .header strong {\n  display: inline-block;\n  width: 250px;\n}\n.calendarHeatmap .heatmapTooltip span {\n  display: inline-block;\n  width: 50%;\n  padding-right: 10px;\n  box-sizing: border-box;\n}\n.calendarHeatmap .heatmapTooltip span,\n.calendarHeatmap .heatmapTooltip .header strong {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 537:
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ 804:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(434);
if(typeof content === 'string') content = [[module.id, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(723)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 723:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(947);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 947:
/***/ ((module) => {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 990:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__990__;

/***/ }),

/***/ 192:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__192__;

/***/ }),

/***/ 244:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__244__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(352);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=calendar-heatmap.js.map