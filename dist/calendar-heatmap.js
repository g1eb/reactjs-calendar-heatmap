(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("moment"), require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["moment", "d3"], factory);
	else if(typeof exports === 'object')
		exports["CalendarHeatmap"] = factory(require("moment"), require("d3"));
	else
		root["CalendarHeatmap"] = factory(root["moment"], root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(2);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calendarHeatmapComponent = __webpack_require__(7);

var _calendarHeatmapComponent2 = _interopRequireDefault(_calendarHeatmapComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _calendarHeatmapComponent2.default;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(8);

var _moment = __webpack_require__(13);

var _moment2 = _interopRequireDefault(_moment);

var _d = __webpack_require__(14);

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalendarHeatmap = function (_Component) {
  _inherits(CalendarHeatmap, _Component);

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
      this.tooltip = d3.select('#calendar-heatmap').append('div').attr('class', 'heatmap-tooltip').style('opacity', 0).style('pointer-events', 'none').style('position', 'absolute').style('z-index', 9999).style('width', '250px').style('max-width', '250px').style('overflow', 'hidden').style('padding', '15px').style('font-size', '12px').style('line-height', '14px').style('color', 'rgb(51, 51, 51)').style('background', 'rgba(255, 255, 255, 0.75)');

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

      // Add month data items to the overview
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

        // Remove all month overview related items and labels
        _this2.removeGlobalOverview();

        // Redraw the chart
        _this2.overview = 'year';
        _this2.drawChart();
      }).style('opacity', 0).on('mouseover', function (d) {
        if (_this2.in_transition) {
          return;
        }

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>Total time tracked:</strong></span>';

        var sec = parseInt(d.total, 10);
        var days = Math.floor(sec / 86400);
        if (days > 0) {
          tooltip_html += '<span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (days === 1 ? '1 day' : days + ' days') + '</span></div>';
        }
        var hours = Math.floor((sec - days * 86400) / 3600);
        if (hours > 0) {
          if (days > 0) {
            tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></span><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
          } else {
            tooltip_html += '<span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
          }
        }
        var minutes = Math.floor((sec - days * 86400 - hours * 3600) / 60);
        if (minutes > 0) {
          if (days > 0 || hours > 0) {
            tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></span><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
          } else {
            tooltip_html += '<span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
          }
        }
        tooltip_html += '<br />';

        // Add summary to the tooltip
        if (d.summary.length <= 5) {
          var counter = 0;
          while (counter < d.summary.length) {
            tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>' + d.summary[counter].name + '</strong></span>';
            tooltip_html += '<span>' + _this2.formatTime(d.summary[counter].value) + '</span></div>';
            counter++;
          }
        } else {
          var _counter = 0;
          while (_counter < 5) {
            tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>' + d.summary[_counter].name + '</strong></span>';
            tooltip_html += '<span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + _this2.formatTime(d.summary[_counter].value) + '</span></div>';
            _counter++;
          }

          tooltip_html += '<br />';

          _counter = 5;
          var other_projects_sum = 0;
          while (_counter < d.summary.length) {
            other_projects_sum = +d.summary[_counter].value;
            _counter++;
          }
          tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>Other:</strong></span>';
          tooltip_html += '<span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + _this2.formatTime(other_projects_sum) + '</span></div>';
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
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (year_label) {
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
      }).on('click', function (d) {
        if (_this2.in_transition) {
          return;
        }

        // Set in_transition flag
        _this2.in_transition = true;

        // Set selected month to the one clicked on
        _this2.selected = d;

        // Hide tooltip
        _this2.hideTooltip();

        // Remove all year overview related items and labels
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
      }).on('click', function (d) {
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
      }).on('mouseover', function (d) {
        if (_this3.in_transition) {
          return;
        }

        // Pulsating animation
        var circle = d3.select(d3.event.currentTarget);
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
        tooltip_html += '<div class="header"><strong style="display: inline-block; width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (d.total ? _this3.formatTime(d.total) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + (0, _moment2.default)(d.date).format('dddd, MMM Do YYYY') + '</div><br>';

        // Add summary to the tooltip
        var counter = 0;
        while (counter < d.summary.length) {
          tooltip_html += '<div><span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>' + d.summary[counter].name + '</strong></span>';
          tooltip_html += '<span style="display: inline-block; width: 50%; padding-right: 10px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + _this3.formatTime(d.summary[counter].value) + '</span></div>';
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
      }).on('mouseout', function () {
        if (_this3.in_transition) {
          return;
        }

        // Set circle radius back to what its supposed to be
        d3.select(d3.event.currentTarget).transition().duration(_this3.settings.transition_duration / 2).ease(d3.easeLinear).attr('x', function (d) {
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
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (d) {
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
      }).on('click', function (d) {
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
      }).on('mouseenter', function (d) {
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
      }).attr('offset', 0).on('click', function (d) {
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
      }).style('opacity', 0).on('mouseover', function (d) {
        if (_this4.in_transition) {
          return;
        }

        // Get date from the parent node
        var parentNode = d3.select(d3.event.currentTarget.parentNode);
        var date = new Date(parentNode.attr('date'));

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="header"><strong style="display: inline-block; width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + d.name + '</strong></div><br>';
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
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (weekday) {
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
      }).on('click', function (d) {
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
      }).on('mouseenter', function (d) {
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
      }).attr('offset', 0).on('click', function (d) {
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
      }).style('opacity', 0).on('mouseover', function (d) {
        if (_this5.in_transition) {
          return;
        }

        // Get date from the parent node
        var parentNode = d3.select(d3.event.currentTarget.parentNode);
        var date = new Date(parentNode.attr('date'));

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="header"><strong style="display: inline-block; width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + d.name + '</strong></div><br>';
        tooltip_html += '<div><strong>' + (d.value ? _this5.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + (0, _moment2.default)(date).format('dddd, MMM Do YYYY') + '</div>';

        // Calculate tooltip position
        var total = parseInt(parentNode.attr('total'));
        itemScale.domain([0, total]);
        var x = parseInt(d3.select(d3.event.currentTarget).attr('x')) + itemScale(d.value) / 4 + _this5.settings.tooltip_width / 4;
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
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (weekday) {
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
      }).on('mouseenter', function (d) {
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
      }).style('opacity', 0).on('mouseover', function (d) {
        if (_this6.in_transition) {
          return;
        }

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="header"><strong style="display: inline-block; width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + d.name + '</strong><div><br>';
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
      }).on('click', function (d) {
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
      }).attr('y', this.settings.label_padding / 2).on('mouseenter', function (d) {
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
      }).on('mouseenter', function (project) {
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
      button.append('text').attr('x', this.settings.label_padding / 3.25).attr('y', this.settings.label_padding / 2.5).attr('dy', function () {
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

      var style = {
        userSelect: 'none',
        fontFamily: 'Helvetica, Arial, sans-serif'
      };

      return React.createElement('div', { id: 'calendar-heatmap', style: style, ref: function ref(elem) {
          _this11.container = elem;
        } });
    }
  }]);

  return CalendarHeatmap;
}(_react.Component);

CalendarHeatmap.defaultProps = {
  data: [],
  overview: 'year',
  color: '#ff4500',
  handler: undefined
};

exports.default = CalendarHeatmap;
module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (process.env.NODE_ENV === 'production') {
  module.exports = __webpack_require__(9);
} else {
  module.exports = __webpack_require__(10);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 React v16.0.0
 react.production.min.js

 Copyright (c) 2013-present, Facebook, Inc.

 This source code is licensed under the MIT license found in the
 LICENSE file in the root directory of this source tree.
*/
var f=__webpack_require__(3),p=__webpack_require__(4);__webpack_require__(1);var r=__webpack_require__(2);
function t(a){for(var b=arguments.length-1,d="Minified React error #"+a+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant\x3d"+a,e=0;e<b;e++)d+="\x26args[]\x3d"+encodeURIComponent(arguments[e+1]);b=Error(d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");b.name="Invariant Violation";b.framesToPop=1;throw b;}
var u={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function v(a,b,d){this.props=a;this.context=b;this.refs=p;this.updater=d||u}v.prototype.isReactComponent={};v.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?t("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState")};v.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function w(a,b,d){this.props=a;this.context=b;this.refs=p;this.updater=d||u}function x(){}x.prototype=v.prototype;var y=w.prototype=new x;y.constructor=w;f(y,v.prototype);y.isPureReactComponent=!0;function z(a,b,d){this.props=a;this.context=b;this.refs=p;this.updater=d||u}var A=z.prototype=new x;A.constructor=z;f(A,v.prototype);A.unstable_isAsyncReactComponent=!0;A.render=function(){return this.props.children};
var B={Component:v,PureComponent:w,AsyncComponent:z},C={current:null},D=Object.prototype.hasOwnProperty,E="function"===typeof Symbol&&Symbol["for"]&&Symbol["for"]("react.element")||60103,F={key:!0,ref:!0,__self:!0,__source:!0};function G(a,b,d,e,c,g,k){return{$$typeof:E,type:a,key:b,ref:d,props:k,_owner:g}}
G.createElement=function(a,b,d){var e,c={},g=null,k=null,m=null,q=null;if(null!=b)for(e in void 0!==b.ref&&(k=b.ref),void 0!==b.key&&(g=""+b.key),m=void 0===b.__self?null:b.__self,q=void 0===b.__source?null:b.__source,b)D.call(b,e)&&!F.hasOwnProperty(e)&&(c[e]=b[e]);var l=arguments.length-2;if(1===l)c.children=d;else if(1<l){for(var h=Array(l),n=0;n<l;n++)h[n]=arguments[n+2];c.children=h}if(a&&a.defaultProps)for(e in l=a.defaultProps,l)void 0===c[e]&&(c[e]=l[e]);return G(a,g,k,m,q,C.current,c)};
G.createFactory=function(a){var b=G.createElement.bind(null,a);b.type=a;return b};G.cloneAndReplaceKey=function(a,b){return G(a.type,b,a.ref,a._self,a._source,a._owner,a.props)};
G.cloneElement=function(a,b,d){var e=f({},a.props),c=a.key,g=a.ref,k=a._self,m=a._source,q=a._owner;if(null!=b){void 0!==b.ref&&(g=b.ref,q=C.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var l=a.type.defaultProps;for(h in b)D.call(b,h)&&!F.hasOwnProperty(h)&&(e[h]=void 0===b[h]&&void 0!==l?l[h]:b[h])}var h=arguments.length-2;if(1===h)e.children=d;else if(1<h){l=Array(h);for(var n=0;n<h;n++)l[n]=arguments[n+2];e.children=l}return G(a.type,c,g,k,m,q,e)};
G.isValidElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===E};var H="function"===typeof Symbol&&Symbol.iterator,I="function"===typeof Symbol&&Symbol["for"]&&Symbol["for"]("react.element")||60103;function escape(a){var b={"\x3d":"\x3d0",":":"\x3d2"};return"$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var J=/\/+/g,K=[];
function L(a,b,d,e){if(K.length){var c=K.pop();c.result=a;c.keyPrefix=b;c.func=d;c.context=e;c.count=0;return c}return{result:a,keyPrefix:b,func:d,context:e,count:0}}function M(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>K.length&&K.push(a)}
function N(a,b,d,e){var c=typeof a;if("undefined"===c||"boolean"===c)a=null;if(null===a||"string"===c||"number"===c||"object"===c&&a.$$typeof===I)return d(e,a,""===b?"."+O(a,0):b),1;var g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var k=0;k<a.length;k++){c=a[k];var m=b+O(c,k);g+=N(c,m,d,e)}else if(m=H&&a[H]||a["@@iterator"],"function"===typeof m)for(a=m.call(a),k=0;!(c=a.next()).done;)c=c.value,m=b+O(c,k++),g+=N(c,m,d,e);else"object"===c&&(d=""+a,t("31","[object Object]"===d?"object with keys {"+
Object.keys(a).join(", ")+"}":d,""));return g}function O(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function P(a,b){a.func.call(a.context,b,a.count++)}function Q(a,b,d){var e=a.result,c=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?R(a,e,d,r.thatReturnsArgument):null!=a&&(G.isValidElement(a)&&(a=G.cloneAndReplaceKey(a,c+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(J,"$\x26/")+"/")+d)),e.push(a))}
function R(a,b,d,e,c){var g="";null!=d&&(g=(""+d).replace(J,"$\x26/")+"/");b=L(b,g,e,c);null==a||N(a,"",Q,b);M(b)}var S={forEach:function(a,b,d){if(null==a)return a;b=L(null,null,b,d);null==a||N(a,"",P,b);M(b)},map:function(a,b,d){if(null==a)return a;var e=[];R(a,e,null,b,d);return e},count:function(a){return null==a?0:N(a,"",r.thatReturnsNull,null)},toArray:function(a){var b=[];R(a,b,null,r.thatReturnsArgument);return b}};
module.exports={Children:{map:S.map,forEach:S.forEach,count:S.count,toArray:S.toArray,only:function(a){G.isValidElement(a)?void 0:t("143");return a}},Component:B.Component,PureComponent:B.PureComponent,unstable_AsyncComponent:B.AsyncComponent,createElement:G.createElement,cloneElement:G.cloneElement,isValidElement:G.isValidElement,createFactory:G.createFactory,version:"16.0.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:C,assign:f}};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/** @license React v16.0.0
 * react.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (process.env.NODE_ENV !== "production") {
(function() {

'use strict';

var objectAssign$1 = __webpack_require__(3);
var require$$0 = __webpack_require__(5);
var emptyObject = __webpack_require__(4);
var invariant = __webpack_require__(1);
var emptyFunction = __webpack_require__(2);
var checkPropTypes = __webpack_require__(11);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule reactProdInvariant
 * 
 */

{
  var warning = require$$0;
}

function warnNoop(publicInstance, callerName) {
  {
    var constructor = publicInstance.constructor;
    warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass');
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var ReactNoopUpdateQueue_1 = ReactNoopUpdateQueue;

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule lowPriorityWarning
 */

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning_1 = lowPriorityWarning;

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue_1;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(ReactComponent.prototype, methodName, {
      get: function () {
        lowPriorityWarning_1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue_1;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
var pureComponentPrototype = ReactPureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
objectAssign$1(pureComponentPrototype, ReactComponent.prototype);
pureComponentPrototype.isPureReactComponent = true;

function ReactAsyncComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue_1;
}

var asyncComponentPrototype = ReactAsyncComponent.prototype = new ComponentDummy();
asyncComponentPrototype.constructor = ReactAsyncComponent;
// Avoid an extra prototype jump for these methods.
objectAssign$1(asyncComponentPrototype, ReactComponent.prototype);
asyncComponentPrototype.unstable_isAsyncReactComponent = true;
asyncComponentPrototype.render = function () {
  return this.props.children;
};

var ReactBaseClasses = {
  Component: ReactComponent,
  PureComponent: ReactPureComponent,
  AsyncComponent: ReactAsyncComponent
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ReactCurrentOwner
 * 
 */

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var ReactCurrentOwner_1 = ReactCurrentOwner;

var hasOwnProperty = Object.prototype.hasOwnProperty;

{
  var warning$2 = require$$0;
}

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE$1 = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown;
var specialPropRefWarningShown;

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warning$2(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warning$2(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE$1,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/react-api.html#createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE$1) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner_1.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/react-api.html#createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/react-api.html#cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = objectAssign$1({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner_1.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE$1;
};

var ReactElement_1 = ReactElement;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ReactDebugCurrentFrame
 * 
 */

var ReactDebugCurrentFrame = {};

{
  // Component that is being worked on
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      return impl();
    }
    return null;
  };
}

var ReactDebugCurrentFrame_1 = ReactDebugCurrentFrame;

{
  var warning$1 = require$$0;

  var _require = ReactDebugCurrentFrame_1,
      getStackAddendum = _require.getStackAddendum;
}

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = ITERATOR_SYMBOL && children[ITERATOR_SYMBOL] || children[FAUX_ITERATOR_SYMBOL];
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning$1(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', getStackAddendum());
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement_1.isValidElement(mappedChild)) {
      mappedChild = ReactElement_1.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  count: countChildren,
  toArray: toArray
};

var ReactChildren_1 = ReactChildren;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ReactVersion
 */

var ReactVersion = '16.0.0';

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement_1.isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

var onlyChild_1 = onlyChild;

/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule describeComponentFrame
 */

var describeComponentFrame$1 = function (name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule getComponentName
 * 
 */

function getComponentName$1(instanceOrFiber) {
  if (typeof instanceOrFiber.getName === 'function') {
    // Stack reconciler
    var instance = instanceOrFiber;
    return instance.getName();
  }
  if (typeof instanceOrFiber.tag === 'number') {
    // Fiber reconciler
    var fiber = instanceOrFiber;
    var type = fiber.type;

    if (typeof type === 'string') {
      return type;
    }
    if (typeof type === 'function') {
      return type.displayName || type.name;
    }
  }
  return null;
}

var getComponentName_1 = getComponentName$1;

{
  var checkPropTypes$1 = checkPropTypes;
  var lowPriorityWarning$1 = lowPriorityWarning_1;
  var ReactDebugCurrentFrame$1 = ReactDebugCurrentFrame_1;
  var warning$3 = require$$0;
  var describeComponentFrame = describeComponentFrame$1;
  var getComponentName = getComponentName_1;

  var currentlyValidatingElement = null;

  var getDisplayName = function (element) {
    if (element == null) {
      return '#empty';
    } else if (typeof element === 'string' || typeof element === 'number') {
      return '#text';
    } else if (typeof element.type === 'string') {
      return element.type;
    } else {
      return element.type.displayName || element.type.name || 'Unknown';
    }
  };

  var getStackAddendum$1 = function () {
    var stack = '';
    if (currentlyValidatingElement) {
      var name = getDisplayName(currentlyValidatingElement);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
    }
    stack += ReactDebugCurrentFrame$1.getStackAddendum() || '';
    return stack;
  };
}

var ITERATOR_SYMBOL$1 = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL$1 = '@@iterator'; // Before Symbol spec.

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner_1.current) {
    var name = getComponentName(ReactCurrentOwner_1.current);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner_1.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
  }

  currentlyValidatingElement = element;
  {
    warning$3(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum$1());
  }
  currentlyValidatingElement = null;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement_1.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement_1.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = ITERATOR_SYMBOL$1 && node[ITERATOR_SYMBOL$1] || node[FAUX_ITERATOR_SYMBOL$1];
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement_1.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  var propTypes = componentClass.propTypes;

  if (propTypes) {
    currentlyValidatingElement = element;
    checkPropTypes$1(propTypes, element.props, 'prop', name, getStackAddendum$1);
    currentlyValidatingElement = null;
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    warning$3(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
  }
}

var ReactElementValidator$1 = {
  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      info += ReactDebugCurrentFrame$1.getStackAddendum() || '';

      warning$3(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info);
    }

    var element = ReactElement_1.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator$1.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement_1.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }
};

var ReactElementValidator_1 = ReactElementValidator$1;

{
  var warning$4 = require$$0;
}

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(Object.prototype.hasOwnProperty)
  // Strip regex characters so we can use it for regex
  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  // Remove hasOwnProperty from the template to make it generic
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function (id, item) {
    itemMap.set(id, item);
  };
  getItem = function (id) {
    return itemMap.get(id);
  };
  removeItem = function (id) {
    itemMap['delete'](id);
  };
  getItemIDs = function () {
    return Array.from(itemMap.keys());
  };

  addRoot = function (id) {
    rootIDSet.add(id);
  };
  removeRoot = function (id) {
    rootIDSet['delete'](id);
  };
  getRootIDs = function () {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {};

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  var getKeyFromID = function (id) {
    return '.' + id;
  };
  var getIDFromKey = function (key) {
    return parseInt(key.substr(1), 10);
  };

  setItem = function (id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = function (id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = function (id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = function () {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function (id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = function (id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = function () {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);
  if (item) {
    var childIDs = item.childIDs;

    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function getDisplayName$1(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName = void 0;

  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  warning$4(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id);
  return describeComponentFrame$1(name || '', element && element._source, ownerName || '');
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = getItem(id);
    !item ? invariant(false, 'Item must have been set') : void 0;
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : void 0;
      !nextChild.isMounted ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }
      !(nextChild.parentID === id) ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = getItem(id);
    !item ? invariant(false, 'Item must have been set') : void 0;
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = getItem(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function () {
    var info = '';
    var currentOwner = ReactCurrentOwner_1.current;
    if (currentOwner) {
      !(typeof currentOwner.tag !== 'number') ? invariant(false, 'Fiber owners should not show up in Stack stack traces.') : void 0;
      if (typeof currentOwner._debugID === 'number') {
        info += ReactComponentTreeHook.getStackAddendumByID(currentOwner._debugID);
      }
    }
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName$1(element);
  },
  getElement: function (id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },


  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs
};

var ReactComponentTreeHook_1 = ReactComponentTreeHook;

var createElement = ReactElement_1.createElement;
var createFactory = ReactElement_1.createFactory;
var cloneElement = ReactElement_1.cloneElement;

{
  var ReactElementValidator = ReactElementValidator_1;
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var React = {
  Children: {
    map: ReactChildren_1.map,
    forEach: ReactChildren_1.forEach,
    count: ReactChildren_1.count,
    toArray: ReactChildren_1.toArray,
    only: onlyChild_1
  },

  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,
  unstable_AsyncComponent: ReactBaseClasses.AsyncComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement_1.isValidElement,

  createFactory: createFactory,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: ReactCurrentOwner_1,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign$1
  }
};

{
  objectAssign$1(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
    // These should not be included in production.
    ReactComponentTreeHook: ReactComponentTreeHook_1,
    ReactDebugCurrentFrame: ReactDebugCurrentFrame_1
  });
}

var ReactEntry = React;

module.exports = ReactEntry;

})();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(1);
  var warning = __webpack_require__(5);
  var ReactPropTypesSecret = __webpack_require__(12);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ })
/******/ ]);
});