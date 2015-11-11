/* jslint bitwise: true */
export default chart => {

  var d3 = require('d3');

  chart.factory('ChartService', ChartService);

  ChartService.$inject = ['$log', '$timeout', 'moment'];

  /* @ngInject */
  function ChartService($log, $timeout, moment) {
    // Constants

    // Base Colours
    var CURRENT_DAY_FILL_BASE = '#da0138';
    var CURRENT_DAY_TEXT_BASE = '#ffffff';
    var EVENT_FILL_BASE = '#ffffff';
    var EVENT_TEXT_BASE = '#000000';

    // Highlights
    var CURRENT_DAY_FILL_HIGHLIGHT = '#da0138';
    var CURRENT_DAY_TEXT_HIGHLIGHT = '#ffffff';
    var EVENT_FILL_HIGHLIGHT = '#e15f01';
    var EVENT_TEXT_HIGHLIGHT = '#ffffff';
    var SEGMENT_FILL_HIGHLIGHT = '#000000';
    var SEGMENT_TEXT_HIGHLIGHT = '#ffffff';

    var service = {
      data: {
        config: {
          calendar: {},
          chart: {},
          events: {}
        }
      },
      setCalendarConfig: setCalendarConfig,
      setChartConfig: setChartConfig,
      setEventsConfig: setEventsConfig,
      markCurrentDay: markCurrentDay,
      markEvents: markEvents,
      focusEvent: focusEvent
    };

    return service;

    function setCalendarConfig(config) {
      service.data.config.calendar = config;
    }

    function setChartConfig(config) {
      service.data.config.chart = config;
    }

    function setEventsConfig(config) {
      service.data.config.events = config;
    }

    /**
     * Colours ring segment based on focus state
     */
    function focusEvent(monthIndex, dayIndex, isFocused) {
      monthIndex = monthIndex;
      dayIndex = (dayIndex + getStartIndex(monthIndex));
      focusSegment(monthIndex, dayIndex, isFocused);
    }

    //////////////////////////////////////////////////////////////////////
    // MARKERS
    //////////////////////////////////////////////////////////////////////

    function markCurrentDay() {
      var currentMonth = parseInt(moment().format('M')) - 1;
      var currentDay = parseInt(moment().format('D')) - 1;
      var day = service.data.config.chart[currentMonth][currentDay + getStartIndex(currentMonth)];

      day.fillColor = CURRENT_DAY_FILL_BASE;
      day.textColor = CURRENT_DAY_TEXT_BASE;
      day.isCurrentDay = true;
    }

    function markEvents() {
      angular.forEach(service.data.config.events, function (event, eventIndex) {
        var eventMonth = parseInt(moment(event.date).format('M')) - 1;
        var eventDay = parseInt(moment(event.date).format('D')) - 1;
        var day = service.data.config.chart[eventMonth][eventDay + getStartIndex(eventMonth)];

        if (!day.isCurrentDay) {
          day.fillColor = EVENT_FILL_BASE;
          day.textColor = EVENT_TEXT_BASE;
        }

        day.isEvent = true;
      });
    }

    //////////////////////////////////////////////////////////////////////
    // HELPERS
    //////////////////////////////////////////////////////////////////////
    function focusSegment(monthIndex, dayIndex, isFocused) {
      // Update row focus
      d3.select('g.chart-ring-' + monthIndex)
        .selectAll('path')
        .transition()
        .duration(150)
        .attr('fill', function (d, i) {
          var fillColour = d.data.fillColor;

          if (isFocused) {
            if (d.data.isActive && !d.data.isEvent && !d.data.isCurrentDay) {
              fillColour = shadeColor(d.data.fillColor, -0.5);
            }
          }

          return fillColour;
        });

      // Update segment color
      d3.select('g.chart-ring-' + monthIndex)
        .select('.segment-' + dayIndex)
        .transition()
        .duration(150)
        .attr('fill', function (d, i) {
          var fillColor = d.data.fillColor;

          if (isFocused) {
            if (d.data.isEvent) {
              fillColor = EVENT_FILL_HIGHLIGHT;
            } else if (d.data.isCurrentDay) {
              fillColor = CURRENT_DAY_FILL_HIGHLIGHT;
            } else {
              fillColor = SEGMENT_FILL_HIGHLIGHT;
            }
          }

          return fillColor;
        });

      // Update text color
      d3.select('g.chart-ring-' + monthIndex)
        .select('.segment-label-' + dayIndex)
        .select('text')
        .transition()
        .duration(150)
        .style('fill', function (d, i) {
          var textColor = d.data.textColor;

          if (isFocused) {
            if (d.data.isEvent) {
              textColor = EVENT_TEXT_HIGHLIGHT;
            } else if (d.data.isCurrentDay) {
              textColor = CURRENT_DAY_TEXT_HIGHLIGHT;
            } else {
              textColor = SEGMENT_TEXT_HIGHLIGHT;
            }
          }

          return textColor;
        });
    }

    function getStartIndex(index) {
      return service.data.config.calendar[index].startIndex;
    }

    //////////////////////////////////////////////////////////////////////
    // UTILITIES
    //////////////////////////////////////////////////////////////////////

    /**
     * Helper method to darken or lighten color
     * @param  {string} color [HEX color code]
     * @param  {int} percent [percentage to lighten or darken base color]
     * @return {string} [Calculated HEX color code]
     */
    function shadeColor(color, percent) {
      var f = parseInt(color.slice(1), 16);
      var t = percent < 0 ? 0 : 255;
      var p = percent < 0 ? percent * -1 : percent;
      var R = f >> 16;
      var G = f >> 8 & 0x00FF;
      var B = f & 0x0000FF;
      return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 +
          (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B))
        .toString(16).slice(1);
    }

    function getMonthIndex(date) {
      return parseInt(moment(date).format('M')) - 1;
    }

    function getDayIndex(date) {
      return parseInt(moment(date).format('D')) - 1;
    }

  }
};
