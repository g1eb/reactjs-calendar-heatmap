import { createRef, Component } from 'react';
import moment from 'moment';
import { select, timeYears, max, scaleBand, scaleLinear, easeLinear, timeMonths, timeDays, scaleTime, timeSecond, timeHours } from 'd3';
import { jsx } from 'react/jsx-runtime';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".calendarHeatmap {\n  font-family: Helvetica, Arial, sans-serif;\n  user-select: none;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n}\n.calendarHeatmap .heatmapTooltip {\n  pointer-events: none;\n  position: absolute;\n  z-index: 9999;\n  width: 250px;\n  max-width: 250px;\n  overflow: hidden;\n  padding: 15px;\n  font-size: 12px;\n  text-align: left;\n  line-height: 14px;\n  color: rgb(51, 51, 51);\n  font-family: Helvetica, arial, 'Open Sans', sans-serif;\n  background: rgba(255, 255, 255, 0.75);\n}\n.calendarHeatmap .heatmapTooltip .header strong {\n  display: inline-block;\n  width: 250px;\n}\n.calendarHeatmap .heatmapTooltip span {\n  display: inline-block;\n  width: 50%;\n  padding-right: 10px;\n  box-sizing: border-box;\n}\n.calendarHeatmap .heatmapTooltip span,\n.calendarHeatmap .heatmapTooltip .header strong {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n";
styleInject(css_248z);

var CalendarHeatmap = /*#__PURE__*/function (_Component) {
  _inherits(CalendarHeatmap, _Component);

  var _super = _createSuper(CalendarHeatmap);

  function CalendarHeatmap(props) {
    var _this;

    _classCallCheck(this, CalendarHeatmap);

    _this = _super.call(this, props);
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
    _this.calcDimensions = _this.calcDimensions.bind(_assertThisInitialized(_this));
    _this.ref = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(CalendarHeatmap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createElements();
      this.parseData();
      this.drawChart();
      window.addEventListener('resize', this.calcDimensions);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.parseData();
      this.drawChart();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.calcDimensions);
    }
  }, {
    key: "createElements",
    value: function createElements() {
      // Create svg element
      this.svg = select('#calendar-heatmap').append('svg').attr('class', 'svg'); // Create other svg elements

      this.items = this.svg.append('g');
      this.labels = this.svg.append('g');
      this.buttons = this.svg.append('g'); // Add tooltip to the same element as main svg

      this.tooltip = select('#calendar-heatmap').append('div').attr('class', 'heatmapTooltip').style('opacity', 0).style('pointer-events', 'none').style('position', 'absolute').style('z-index', 9999).style('width', '250px').style('max-width', '250px').style('overflow', 'hidden').style('padding', '15px').style('font-size', '12px').style('line-height', '14px').style('color', 'rgb(51, 51, 51)').style('background', 'rgba(255, 255, 255, 0.75)');
      this.calcDimensions();
    } // Calculate dimensions based on available width

  }, {
    key: "calcDimensions",
    value: function calcDimensions() {
      var _this$ref$current$off, _this$ref$current;

      var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;
      var offsetWidth = (_this$ref$current$off = (_this$ref$current = this.ref.current) === null || _this$ref$current === void 0 ? void 0 : _this$ref$current.offsetWidth) !== null && _this$ref$current$off !== void 0 ? _this$ref$current$off : NaN;
      this.settings.width = offsetWidth < 1000 ? 1000 : offsetWidth;
      this.settings.item_size = (this.settings.width - this.settings.label_padding) / numWeeks - this.settings.gutter;
      this.settings.height = this.settings.label_padding + 7 * (this.settings.item_size + this.settings.gutter);
      this.svg.attr('width', this.settings.width).attr('height', this.settings.height);

      if (!!this.props.data && !!this.props.data[0].summary) {
        this.drawChart();
      }
    }
  }, {
    key: "parseData",
    value: function parseData() {
      if (!this.props.data) {
        return;
      } // Get daily summary if that was not provided


      if (!this.props.data[0].summary) {
        this.props.data.map(function (d) {
          var summary = d.details.reduce(function (uniques, project) {
            if (!uniques[project.name]) {
              uniques[project.name] = {
                value: project.value
              };
            } else {
              uniques[project.name].value += project.value;
            }

            return uniques;
          }, {});
          var unsorted_summary = Object.keys(summary).map(function (key) {
            return {
              name: key,
              value: summary[key].value
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
    key: "drawChart",
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
    key: "drawGlobalOverview",
    value: function drawGlobalOverview() {
      var _this2 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      } // Define start and end of the dataset


      var start = moment(this.props.data[0].date).startOf('year');
      var end = moment(this.props.data[this.props.data.length - 1].date).endOf('year'); // Define array of years and total values

      var year_data = timeYears(start, end).map(function (d) {
        var date = moment(d);

        var getSummary = function getSummary() {
          var summary = _this2.props.data.reduce(function (summary, d) {
            if (moment(d.date).year() === date.year()) {
              d.summary.map(function (item) {
                if (!summary[item.name]) {
                  summary[item.name] = {
                    value: item.value
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
              name: key,
              value: summary[key].value
            };
          });
          return unsorted_summary.sort(function (a, b) {
            return b.value - a.value;
          });
        };

        return {
          date: date,
          total: _this2.props.data.reduce(function (prev, current) {
            if (moment(current.date).year() === date.year()) {
              prev += current.total;
            }

            return prev;
          }, 0),
          summary: getSummary()
        };
      }); // Calculate max value of all the years in the dataset

      var max_value = max(year_data, function (d) {
        return d.total;
      }); // Define year labels and axis

      var year_labels = timeYears(start, end).map(function (d) {
        return moment(d);
      });
      var yearScale = scaleBand().rangeRound([0, this.settings.width]).padding([0.05]).domain(year_labels.map(function (d) {
        return d.year();
      })); // Add global data items to the overview

      this.items.selectAll('.item-block-year').remove();
      this.items.selectAll('.item-block-year').data(year_data).enter().append('rect').attr('class', 'item item-block-year').style('cursor', 'pointer').attr('width', function () {
        return (_this2.settings.width - _this2.settings.label_padding) / year_labels.length - _this2.settings.gutter * 5;
      }).attr('height', function () {
        return _this2.settings.height - _this2.settings.label_padding;
      }).attr('transform', function (d) {
        return 'translate(' + yearScale(d.date.year()) + ',' + _this2.settings.tooltip_padding * 2 + ')';
      }).attr('fill', function (d) {
        var color = scaleLinear().range(['#ffffff', _this2.props.color]).domain([-0.15 * max_value, max_value]);
        return color(d.total) || '#ff4500';
      }).on('click', function (_event, datum) {
        var _this2$props$onHideTo, _this2$props;

        if (_this2.in_transition) {
          return;
        } // Set in_transition flag


        _this2.in_transition = true; // Set selected date to the one clicked on
        // 'datum' provides the data that this element contains. Ref: https://github.com/d3/d3-selection/blob/main/README.md#handling-events

        _this2.selected = datum; // Hide tooltip

        (_this2$props$onHideTo = (_this2$props = _this2.props).onHideTooltip) === null || _this2$props$onHideTo === void 0 ? void 0 : _this2$props$onHideTo.call(_this2$props); // Remove all global overview related items and labels

        _this2.removeGlobalOverview(); // Redraw the chart


        _this2.overview = 'year';

        _this2.drawChart();
      }).style('opacity', 0).on('mouseover', function (_event, d) {
        var _this2$props$onToolti, _this2$props2;

        if (_this2.in_transition) {
          return;
        }

        (_this2$props$onToolti = (_this2$props2 = _this2.props).onTooltip) === null || _this2$props$onToolti === void 0 ? void 0 : _this2$props$onToolti.call(_this2$props2, {
          value: d
        });
      }).on('mouseout', function () {
        var _this2$props$onHideTo2, _this2$props3;

        if (_this2.in_transition) {
          return;
        }

        (_this2$props$onHideTo2 = (_this2$props3 = _this2.props).onHideTooltip) === null || _this2$props$onHideTo2 === void 0 ? void 0 : _this2$props$onHideTo2.call(_this2$props3);
      }).transition().delay(function (d, i) {
        return _this2.settings.transition_duration * (i + 1) / 10;
      }).duration(function () {
        return _this2.settings.transition_duration;
      }).ease(easeLinear).style('opacity', 1).call(function (transition, callback) {
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
      }); // Add year labels

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

        _this2.items.selectAll('.item-block-year').transition().duration(_this2.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).year() === year_label.year() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this2.in_transition) {
          return;
        }

        _this2.items.selectAll('.item-block-year').transition().duration(_this2.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }).on('click', function (event, d) {
        var _this2$props$onHideTo3, _this2$props4;

        if (_this2.in_transition) {
          return;
        } // Set in_transition flag


        _this2.in_transition = true; // Set selected year to the one clicked on

        _this2.selected = {
          date: d
        }; // Hide tooltip

        (_this2$props$onHideTo3 = (_this2$props4 = _this2.props).onHideTooltip) === null || _this2$props$onHideTo3 === void 0 ? void 0 : _this2$props$onHideTo3.call(_this2$props4); // Remove all global overview related items and labels

        _this2.removeGlobalOverview(); // Redraw the chart


        _this2.overview = 'year';

        _this2.drawChart();
      });
    }
    /**
     * Draw year overview
     */

  }, {
    key: "drawYearOverview",
    value: function drawYearOverview() {
      var _this3 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      } // Define start and end date of the selected year


      var start_of_year = moment(this.selected.date).startOf('year');
      var end_of_year = moment(this.selected.date).endOf('year'); // Filter data down to the selected year

      var year_data = this.props.data.filter(function (d) {
        return start_of_year <= moment(d.date) && moment(d.date) < end_of_year;
      }); // Calculate max value of the year data

      var max_value = max(year_data, function (d) {
        return d.total;
      });
      var color = scaleLinear().range(['#ffffff', this.props.color]).domain([-0.15 * max_value, max_value]);

      var calcItemX = function calcItemX(d) {
        var date = moment(d.date);
        var dayIndex = Math.round((date - moment(start_of_year).startOf('week')) / 86400000);
        var colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (_this3.settings.item_size + _this3.settings.gutter) + _this3.settings.label_padding;
      };

      var calcItemY = function calcItemY(d) {
        return _this3.settings.label_padding + moment(d.date).weekday() * (_this3.settings.item_size + _this3.settings.gutter);
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
        var _this3$props$onHideTo, _this3$props;

        if (_this3.in_transition) {
          return;
        } // Don't transition if there is no data to show


        if (d.total === 0) {
          return;
        }

        _this3.in_transition = true; // Set selected date to the one clicked on

        _this3.selected = d; // Hide tooltip

        (_this3$props$onHideTo = (_this3$props = _this3.props).onHideTooltip) === null || _this3$props$onHideTo === void 0 ? void 0 : _this3$props$onHideTo.call(_this3$props); // Remove all year overview related items and labels

        _this3.removeYearOverview(); // Redraw the chart


        _this3.overview = 'day';

        _this3.drawChart();
      }).on('mouseover', function (event, d) {
        var _this3$props$onToolti, _this3$props2;

        if (_this3.in_transition) {
          return;
        } // Pulsating animation


        var circle = select(event.currentTarget);

        var repeat = function repeat() {
          circle = circle.transition().duration(_this3.settings.transition_duration).ease(easeLinear).attr('x', function (d) {
            return calcItemX(d) - (_this3.settings.item_size * 1.1 - _this3.settings.item_size) / 2;
          }).attr('y', function (d) {
            return calcItemY(d) - (_this3.settings.item_size * 1.1 - _this3.settings.item_size) / 2;
          }).attr('width', _this3.settings.item_size * 1.1).attr('height', _this3.settings.item_size * 1.1).transition().duration(_this3.settings.transition_duration).ease(easeLinear).attr('x', function (d) {
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
        (_this3$props$onToolti = (_this3$props2 = _this3.props).onTooltip) === null || _this3$props$onToolti === void 0 ? void 0 : _this3$props$onToolti.call(_this3$props2, {
          value: d
        });
      }).on('mouseout', function (event, d) {
        var _this3$props$onHideTo2, _this3$props3;

        if (_this3.in_transition) {
          return;
        } // Set circle radius back to what its supposed to be


        select(event.currentTarget).transition().duration(_this3.settings.transition_duration / 2).ease(easeLinear).attr('x', function (d) {
          return calcItemX(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
        }).attr('y', function (d) {
          return calcItemY(d) + (_this3.settings.item_size - calcItemSize(d)) / 2;
        }).attr('width', function (d) {
          return calcItemSize(d);
        }).attr('height', function (d) {
          return calcItemSize(d);
        }); // Hide tooltip

        (_this3$props$onHideTo2 = (_this3$props3 = _this3.props).onHideTooltip) === null || _this3$props$onHideTo2 === void 0 ? void 0 : _this3$props$onHideTo2.call(_this3$props3);
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this3.settings.transition_duration;
      }).duration(function () {
        return _this3.settings.transition_duration;
      }).ease(easeLinear).style('opacity', 1).call(function (transition, callback) {
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
      }); // Add month labels

      var month_labels = timeMonths(start_of_year, end_of_year);
      var monthScale = scaleLinear().range([0, this.settings.width]).domain([0, month_labels.length]);
      this.labels.selectAll('.label-month').remove();
      this.labels.selectAll('.label-month').data(month_labels).enter().append('text').attr('class', 'label label-month').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this3.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return d.toLocaleDateString('en-us', {
          month: 'short'
        });
      }).attr('x', function (d, i) {
        return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2;
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        var selected_month = moment(d);

        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this3.in_transition) {
          return;
        }

        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }).on('click', function (event, d) {
        var _this3$props$onHideTo3, _this3$props4;

        if (_this3.in_transition) {
          return;
        } // Check month data


        var month_data = _this3.props.data.filter(function (e) {
          return moment(d).startOf('month') <= moment(e.date) && moment(e.date) < moment(d).endOf('month');
        }); // Don't transition if there is no data to show


        if (!month_data.length) {
          return;
        } // Set selected month to the one clicked on


        _this3.selected = {
          date: d
        };
        _this3.in_transition = true; // Hide tooltip

        (_this3$props$onHideTo3 = (_this3$props4 = _this3.props).onHideTooltip) === null || _this3$props$onHideTo3 === void 0 ? void 0 : _this3$props$onHideTo3.call(_this3$props4); // Remove all year overview related items and labels

        _this3.removeYearOverview(); // Redraw the chart


        _this3.overview = 'month';

        _this3.drawChart();
      }); // Add day labels

      var day_labels = timeDays(moment().startOf('week'), moment().endOf('week'));
      var dayScale = scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(day_labels.map(function (d) {
        return moment(d).weekday();
      }));
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day').data(day_labels).enter().append('text').attr('class', 'label label-day').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 3).attr('y', function (d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this3.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return moment(d).format('dddd')[0];
      }).on('mouseenter', function (event, d) {
        if (_this3.in_transition) {
          return;
        }

        var selected_day = moment(d);

        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).day() === selected_day.day() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this3.in_transition) {
          return;
        }

        _this3.items.selectAll('.item-circle').transition().duration(_this3.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }); // Add button to switch back to previous overview

      this.drawButton();
    }
    /**
     * Draw month overview
     */

  }, {
    key: "drawMonthOverview",
    value: function drawMonthOverview() {
      var _this4 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      } // Define beginning and end of the month


      var start_of_month = moment(this.selected.date).startOf('month');
      var end_of_month = moment(this.selected.date).endOf('month'); // Filter data down to the selected month

      var month_data = this.props.data.filter(function (d) {
        return start_of_month <= moment(d.date) && moment(d.date) < end_of_month;
      });
      var max_value = max(month_data, function (d) {
        return max(d.summary, function (d) {
          return d.value;
        });
      }); // Define day labels and axis

      var day_labels = timeDays(moment().startOf('week'), moment().endOf('week'));
      var dayScale = scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(day_labels.map(function (d) {
        return moment(d).weekday();
      })); // Define week labels and axis

      var week_labels = [start_of_month.clone()];

      while (start_of_month.week() !== end_of_month.week()) {
        week_labels.push(start_of_month.add(1, 'week').clone());
      }

      var weekScale = scaleBand().rangeRound([this.settings.label_padding, this.settings.width]).padding([0.05]).domain(week_labels.map(function (weekday) {
        return weekday.week();
      })); // Add month data items to the overview

      this.items.selectAll('.item-block-month').remove();
      var item_block = this.items.selectAll('.item-block-month').data(month_data).enter().append('g').attr('class', 'item item-block-month').style('cursor', 'pointer').attr('width', function () {
        return (_this4.settings.width - _this4.settings.label_padding) / week_labels.length - _this4.settings.gutter * 5;
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this4.settings.max_block_height);
      }).attr('transform', function (d) {
        return 'translate(' + weekScale(moment(d.date).week()) + ',' + (dayScale(moment(d.date).weekday()) + dayScale.bandwidth() / 1.75 - 15) + ')';
      }).attr('total', function (d) {
        return d.total;
      }).attr('date', function (d) {
        return d.date;
      }).attr('offset', 0).on('click', function (event, d) {
        var _this4$props$onHideTo, _this4$props;

        if (_this4.in_transition) {
          return;
        } // Don't transition if there is no data to show


        if (d.total === 0) {
          return;
        }

        _this4.in_transition = true; // Set selected date to the one clicked on

        _this4.selected = d; // Hide tooltip

        (_this4$props$onHideTo = (_this4$props = _this4.props).onHideTooltip) === null || _this4$props$onHideTo === void 0 ? void 0 : _this4$props$onHideTo.call(_this4$props); // Remove all month overview related items and labels

        _this4.removeMonthOverview(); // Redraw the chart


        _this4.overview = 'day';

        _this4.drawChart();
      });
      var item_width = (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5;
      var itemScale = scaleLinear().rangeRound([0, item_width]);
      var item_gutter = this.settings.item_gutter;
      item_block.selectAll('.item-block-rect').data(function (d) {
        return d.summary;
      }).enter().append('rect').attr('class', 'item item-block-rect').style('cursor', 'pointer').attr('x', function (d) {
        var total = parseInt(select(this.parentNode).attr('total'));
        var offset = parseInt(select(this.parentNode).attr('offset'));
        itemScale.domain([0, total]);
        select(this.parentNode).attr('offset', offset + itemScale(d.value));
        return offset;
      }).attr('width', function (d) {
        var total = parseInt(select(this.parentNode).attr('total'));
        itemScale.domain([0, total]);
        return Math.max(itemScale(d.value) - item_gutter, 1);
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this4.settings.max_block_height);
      }).attr('fill', function (d) {
        var color = scaleLinear().range(['#ffffff', _this4.props.color]).domain([-0.15 * max_value, max_value]);
        return color(d.value) || '#ff4500';
      }).style('opacity', 0).on('mouseover', function (event, d) {
        var _this4$props$onToolti, _this4$props2;

        if (_this4.in_transition) {
          return;
        }

        (_this4$props$onToolti = (_this4$props2 = _this4.props).onTooltip) === null || _this4$props$onToolti === void 0 ? void 0 : _this4$props$onToolti.call(_this4$props2, {
          value: d
        });
      }).on('mouseout', function () {
        var _this4$props$onHideTo2, _this4$props3;

        if (_this4.in_transition) {
          return;
        }

        (_this4$props$onHideTo2 = (_this4$props3 = _this4.props).onHideTooltip) === null || _this4$props$onHideTo2 === void 0 ? void 0 : _this4$props$onHideTo2.call(_this4$props3);
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this4.settings.transition_duration;
      }).duration(function () {
        return _this4.settings.transition_duration;
      }).ease(easeLinear).style('opacity', 1).call(function (transition, callback) {
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
      }); // Add week labels

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

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).week() === weekday.week() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this4.in_transition) {
          return;
        }

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }).on('click', function (event, d) {
        var _this4$props$onHideTo3, _this4$props4;

        if (_this4.in_transition) {
          return;
        } // Check week data


        var week_data = _this4.props.data.filter(function (e) {
          return d.startOf('week') <= moment(e.date) && moment(e.date) < d.endOf('week');
        }); // Don't transition if there is no data to show


        if (!week_data.length) {
          return;
        }

        _this4.in_transition = true; // Set selected month to the one clicked on

        _this4.selected = {
          date: d
        }; // Hide tooltip

        (_this4$props$onHideTo3 = (_this4$props4 = _this4.props).onHideTooltip) === null || _this4$props$onHideTo3 === void 0 ? void 0 : _this4$props$onHideTo3.call(_this4$props4); // Remove all year overview related items and labels

        _this4.removeMonthOverview(); // Redraw the chart


        _this4.overview = 'week';

        _this4.drawChart();
      }); // Add day labels

      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day').data(day_labels).enter().append('text').attr('class', 'label label-day').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 3).attr('y', function (d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this4.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return moment(d).format('dddd')[0];
      }).on('mouseenter', function (event, d) {
        if (_this4.in_transition) {
          return;
        }

        var selected_day = moment(d);

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).day() === selected_day.day() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this4.in_transition) {
          return;
        }

        _this4.items.selectAll('.item-block-month').transition().duration(_this4.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }); // Add button to switch back to previous overview

      this.drawButton();
    }
    /**
     * Draw week overview
     */

  }, {
    key: "drawWeekOverview",
    value: function drawWeekOverview() {
      var _this5 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      } // Define beginning and end of the week


      var start_of_week = moment(this.selected.date).startOf('week');
      var end_of_week = moment(this.selected.date).endOf('week'); // Filter data down to the selected week

      var week_data = this.props.data.filter(function (d) {
        return start_of_week <= moment(d.date) && moment(d.date) < end_of_week;
      });
      var max_value = max(week_data, function (d) {
        return max(d.summary, function (d) {
          return d.value;
        });
      }); // Define day labels and axis

      var day_labels = timeDays(moment().startOf('week'), moment().endOf('week'));
      var dayScale = scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(day_labels.map(function (d) {
        return moment(d).weekday();
      })); // Define week labels and axis

      var week_labels = [start_of_week];
      var weekScale = scaleBand().rangeRound([this.settings.label_padding, this.settings.width]).padding([0.01]).domain(week_labels.map(function (weekday) {
        return weekday.week();
      })); // Add week data items to the overview

      this.items.selectAll('.item-block-week').remove();
      var item_block = this.items.selectAll('.item-block-week').data(week_data).enter().append('g').attr('class', 'item item-block-week').style('cursor', 'pointer').attr('width', function () {
        return (_this5.settings.width - _this5.settings.label_padding) / week_labels.length - _this5.settings.gutter * 5;
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this5.settings.max_block_height);
      }).attr('transform', function (d) {
        return 'translate(' + weekScale(moment(d.date).week()) + ',' + (dayScale(moment(d.date).weekday()) + dayScale.bandwidth() / 1.75 - 15) + ')';
      }).attr('total', function (d) {
        return d.total;
      }).attr('date', function (d) {
        return d.date;
      }).attr('offset', 0).on('click', function (event, d) {
        var _this5$props$onHideTo, _this5$props;

        if (_this5.in_transition) {
          return;
        } // Don't transition if there is no data to show


        if (d.total === 0) {
          return;
        }

        _this5.in_transition = true; // Set selected date to the one clicked on

        _this5.selected = d; // Hide tooltip

        (_this5$props$onHideTo = (_this5$props = _this5.props).onHideTooltip) === null || _this5$props$onHideTo === void 0 ? void 0 : _this5$props$onHideTo.call(_this5$props); // Remove all week overview related items and labels

        _this5.removeWeekOverview(); // Redraw the chart


        _this5.overview = 'day';

        _this5.drawChart();
      });
      var item_width = (this.settings.width - this.settings.label_padding) / week_labels.length - this.settings.gutter * 5;
      var itemScale = scaleLinear().rangeRound([0, item_width]);
      var item_gutter = this.settings.item_gutter;
      item_block.selectAll('.item-block-rect').data(function (d) {
        return d.summary;
      }).enter().append('rect').attr('class', 'item item-block-rect').style('cursor', 'pointer').attr('x', function (d) {
        var total = parseInt(select(this.parentNode).attr('total'));
        var offset = parseInt(select(this.parentNode).attr('offset'));
        itemScale.domain([0, total]);
        select(this.parentNode).attr('offset', offset + itemScale(d.value));
        return offset;
      }).attr('width', function (d) {
        var total = parseInt(select(this.parentNode).attr('total'));
        itemScale.domain([0, total]);
        return Math.max(itemScale(d.value) - item_gutter, 1);
      }).attr('height', function () {
        return Math.min(dayScale.bandwidth(), _this5.settings.max_block_height);
      }).attr('fill', function (d) {
        var color = scaleLinear().range(['#ffffff', _this5.props.color]).domain([-0.15 * max_value, max_value]);
        return color(d.value) || '#ff4500';
      }).style('opacity', 0).on('mouseover', function (_event, d) {
        var _this5$props$onToolti, _this5$props2;

        if (_this5.in_transition) {
          return;
        }

        (_this5$props$onToolti = (_this5$props2 = _this5.props).onTooltip) === null || _this5$props$onToolti === void 0 ? void 0 : _this5$props$onToolti.call(_this5$props2, {
          value: d
        });
      }).on('mouseout', function () {
        var _this5$props$onHideTo2, _this5$props3;

        if (_this5.in_transition) {
          return;
        }

        (_this5$props$onHideTo2 = (_this5$props3 = _this5.props).onHideTooltip) === null || _this5$props$onHideTo2 === void 0 ? void 0 : _this5$props$onHideTo2.call(_this5$props3);
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this5.settings.transition_duration;
      }).duration(function () {
        return _this5.settings.transition_duration;
      }).ease(easeLinear).style('opacity', 1).call(function (transition, callback) {
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
      }); // Add week labels

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

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).week() === weekday.week() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this5.in_transition) {
          return;
        }

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }); // Add day labels

      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day').data(day_labels).enter().append('text').attr('class', 'label label-day').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('x', this.settings.label_padding / 3).attr('y', function (d, i) {
        return dayScale(i) + dayScale.bandwidth() / 1.75;
      }).style('text-anchor', 'left').attr('font-size', function () {
        return Math.floor(_this5.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return moment(d).format('dddd')[0];
      }).on('mouseenter', function (event, d) {
        if (_this5.in_transition) {
          return;
        }

        var selected_day = moment(d);

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return moment(d.date).day() === selected_day.day() ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this5.in_transition) {
          return;
        }

        _this5.items.selectAll('.item-block-week').transition().duration(_this5.settings.transition_duration).ease(easeLinear).style('opacity', 1);
      }); // Add button to switch back to previous overview

      this.drawButton();
    }
    /**
     * Draw day overview
     */

  }, {
    key: "drawDayOverview",
    value: function drawDayOverview() {
      var _this6 = this;

      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      } // Initialize selected date to today if it was not set


      if (!Object.keys(this.selected).length) {
        this.selected = this.props.data[this.props.data.length - 1];
      }

      var project_labels = this.selected.summary.map(function (project) {
        return project.name;
      });
      var projectScale = scaleBand().rangeRound([this.settings.label_padding, this.settings.height]).domain(project_labels);
      var itemScale = scaleTime().range([this.settings.label_padding * 2, this.settings.width]).domain([moment(this.selected.date).startOf('day'), moment(this.selected.date).endOf('day')]);
      this.items.selectAll('.item-block').remove();
      this.items.selectAll('.item-block').data(this.selected.details).enter().append('rect').attr('class', 'item item-block').style('cursor', 'pointer').attr('x', function (d) {
        return itemScale(moment(d.date));
      }).attr('y', function (d) {
        return projectScale(d.name) + projectScale.bandwidth() / 2 - 15;
      }).attr('width', function (d) {
        var end = itemScale(timeSecond.offset(moment(d.date), d.value));
        return Math.max(end - itemScale(moment(d.date)), 1);
      }).attr('height', function () {
        return Math.min(projectScale.bandwidth(), _this6.settings.max_block_height);
      }).attr('fill', function () {
        return _this6.props.color;
      }).style('opacity', 0).on('mouseover', function (_event, d) {
        var _this6$props$onToolti, _this6$props;

        if (_this6.in_transition) {
          return;
        }

        (_this6$props$onToolti = (_this6$props = _this6.props).onTooltip) === null || _this6$props$onToolti === void 0 ? void 0 : _this6$props$onToolti.call(_this6$props, {
          value: d
        });
      }).on('mouseout', function () {
        var _this6$props$onHideTo, _this6$props2;

        if (_this6.in_transition) {
          return;
        }

        (_this6$props$onHideTo = (_this6$props2 = _this6.props).onHideTooltip) === null || _this6$props$onHideTo === void 0 ? void 0 : _this6$props$onHideTo.call(_this6$props2);
      }).on('click', function (event, d) {
        if (!!_this6.props.handler && typeof _this6.props.handler == 'function') {
          _this6.props.handler(d);
        }
      }).transition().delay(function () {
        return (Math.cos(Math.PI * Math.random()) + 1) * _this6.settings.transition_duration;
      }).duration(function () {
        return _this6.settings.transition_duration;
      }).ease(easeLinear).style('opacity', 0.5).call(function (transition, callback) {
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
      }); // Add time labels

      var timeLabels = timeHours(moment(this.selected.date).startOf('day'), moment(this.selected.date).endOf('day'));
      var timeScale = scaleTime().range([this.settings.label_padding * 2, this.settings.width]).domain([0, timeLabels.length]);
      this.labels.selectAll('.label-time').remove();
      this.labels.selectAll('.label-time').data(timeLabels).enter().append('text').attr('class', 'label label-time').style('cursor', 'pointer').style('fill', 'rgb(170, 170, 170)').attr('font-size', function () {
        return Math.floor(_this6.settings.label_padding / 3) + 'px';
      }).text(function (d) {
        return moment(d).format('HH:mm');
      }).attr('x', function (d, i) {
        return timeScale(i);
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (event, d) {
        if (_this6.in_transition) {
          return;
        }

        var selected = itemScale(moment(d));

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          var start = itemScale(moment(d.date));
          var end = itemScale(moment(d.date).add(d.value, 'seconds'));
          return selected >= start && selected <= end ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this6.in_transition) {
          return;
        }

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(easeLinear).style('opacity', 0.5);
      }); // Add project labels

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
        var obj = select(this),
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

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(easeLinear).style('opacity', function (d) {
          return d.name === project ? 1 : 0.1;
        });
      }).on('mouseout', function () {
        if (_this6.in_transition) {
          return;
        }

        _this6.items.selectAll('.item-block').transition().duration(_this6.settings.transition_duration).ease(easeLinear).style('opacity', 0.5);
      }); // Add button to switch back to previous overview

      this.drawButton();
    }
    /**
     * Draw the button for navigation purposes
     */

  }, {
    key: "drawButton",
    value: function drawButton() {
      var _this7 = this;

      this.buttons.selectAll('.button').remove();
      var button = this.buttons.append('g').attr('class', 'button button-back').style('cursor', 'pointer').attr('fill', 'transparent').style('opacity', 0).style('stroke-width', 2).style('stroke', 'rgb(170, 170, 170)').on('click', function () {
        if (_this7.in_transition) {
          return;
        } // Set transition boolean


        _this7.in_transition = true; // Clean the canvas from whichever overview type was on

        if (_this7.overview === 'year') {
          _this7.removeYearOverview();
        } else if (_this7.overview === 'month') {
          _this7.removeMonthOverview();
        } else if (_this7.overview === 'week') {
          _this7.removeWeekOverview();
        } else if (_this7.overview === 'day') {
          _this7.removeDayOverview();
        } // Redraw the chart


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
      button.transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 1);
    }
    /**
     * Transition and remove items and labels related to global overview
     */

  }, {
    key: "removeGlobalOverview",
    value: function removeGlobalOverview() {
      this.items.selectAll('.item-block-year').transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 0).remove();
      this.labels.selectAll('.label-year').remove();
    }
    /**
     * Transition and remove items and labels related to year overview
     */

  }, {
    key: "removeYearOverview",
    value: function removeYearOverview() {
      this.items.selectAll('.item-circle').transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 0).remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-month').remove();
      this.hideBackButton();
    }
    /**
     * Transition and remove items and labels related to month overview
     */

  }, {
    key: "removeMonthOverview",
    value: function removeMonthOverview() {
      var _this8 = this;

      this.items.selectAll('.item-block-month').selectAll('.item-block-rect').transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 0).attr('x', function (d, i) {
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
    key: "removeWeekOverview",
    value: function removeWeekOverview() {
      var _this9 = this;

      this.items.selectAll('.item-block-week').selectAll('.item-block-rect').transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 0).attr('x', function (d, i) {
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
    key: "removeDayOverview",
    value: function removeDayOverview() {
      var _this10 = this;

      this.items.selectAll('.item-block').transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 0).attr('x', function (d, i) {
        return i % 2 === 0 ? -_this10.settings.width / 3 : _this10.settings.width / 3;
      }).remove();
      this.labels.selectAll('.label-time').remove();
      this.labels.selectAll('.label-project').remove();
      this.hideBackButton();
    }
    /**
     * Helper function to hide the back button
     */

  }, {
    key: "hideBackButton",
    value: function hideBackButton() {
      this.buttons.selectAll('.button').transition().duration(this.settings.transition_duration).ease(easeLinear).style('opacity', 0).remove();
    }
    /**
     * Helper function to convert seconds to a human readable format
     * @param seconds Integer
     */

  }, {
    key: "formatTime",
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
    key: "render",
    value: function render() {
      return /*#__PURE__*/jsx("div", {
        id: "calendar-heatmap",
        className: "calendarHeatmap",
        ref: this.ref
      });
    }
  }]);

  return CalendarHeatmap;
}(Component);
CalendarHeatmap.defaultProps = {
  data: [],
  overview: 'year',
  color: '#ff4500',
  handler: undefined
};

export { CalendarHeatmap };
