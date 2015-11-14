export default chart => {

  var d3 = require('d3');

  chart.factory('ChartService', ChartService);

  ChartService.$inject = ['$log', '$timeout', 'moment', 'lodash', 'Utilities'];

  /* @ngInject */
  function ChartService($log, $timeout, moment, lodash, Utilities) {

    var service = {
      data: {
        config: {
          defaults: {},
          calendar: {},
          chart: {},
          events: {}
        }
      },
      setCalendarConfig: setCalendarConfig,
      setChartConfig: setChartConfig,
      setEventsConfig: setEventsConfig,
      setDefaultsConfig: setDefaultsConfig,
      getMonth: getMonth,
      getDay: getDay,
      markCurrentDay: markCurrentDay,
      markEvents: markEvents,
      focusEvent: focusEvent
    };

    return service;

    //////////////////////////////////////////////////////////////////////
    // SETTERS
    //////////////////////////////////////////////////////////////////////

    function setCalendarConfig(config) {
      service.data.config.calendar = config;
    }

    function setChartConfig(config) {
      service.data.config.chart = config;
    }

    function setEventsConfig(config) {
      service.data.config.events = config;
    }

    function setDefaultsConfig(config) {
      service.data.config.defaults = config;
    }

    //////////////////////////////////////////////////////////////////////
    // GETTERS
    //////////////////////////////////////////////////////////////////////

    function getMonth(year, month) {
      var monthObj = service.data.config.chart[Utilities.getMonthIndex(month)];

      return lodash.filter(monthObj, {
        isActive: true
      });
    }

    function getDay(year, month, day) {
      var dayObj = lodash.find(service.data.config.chart[Utilities.getMonthIndex(month)], {
        'day': day
      });

      return dayObj;
    }

    //////////////////////////////////////////////////////////////////////
    // MARKERS
    //////////////////////////////////////////////////////////////////////

    function markCurrentDay() {
      var currentMonth = parseInt(moment().format('M')) - 1;
      var currentDay = parseInt(moment().format('D')) - 1;
      var day = service.data.config.chart[currentMonth][currentDay + getStartIndex(currentMonth)];

      day.fillColor = service.data.config.defaults.CURRENT_DAY_FILL_BASE;
      day.textColor = service.data.config.defaults.CURRENT_DAY_TEXT_BASE;
      day.isCurrentDay = true;
    }

    function markEvents() {
      angular.forEach(service.data.config.events, function (event, eventIndex) {
        var eventMonth = parseInt(moment(event.date).format('M')) - 1;
        var eventDay = parseInt(moment(event.date).format('D')) - 1;
        var day = service.data.config.chart[eventMonth][eventDay + getStartIndex(eventMonth)];

        if (!day.isCurrentDay) {
          day.fillColor = service.data.config.defaults.EVENT_FILL_BASE;
          day.textColor = service.data.config.defaults.EVENT_TEXT_BASE;
        }

        day.isEvent = true;
      });
    }

    //////////////////////////////////////////////////////////////////////
    // HELPERS
    //////////////////////////////////////////////////////////////////////

    /**
     * Colours ring segment based on focus state
     */
    function focusEvent(monthIndex, dayIndex, isFocused) {
      monthIndex = monthIndex;
      dayIndex = (dayIndex + getStartIndex(monthIndex));
      focusSegment(monthIndex, dayIndex, isFocused);
    }

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
              fillColour = Utilities.shadeColor(d.data.fillColor, -0.5);
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
              fillColor = service.data.config.defaults.EVENT_FILL_HIGHLIGHT;
            } else if (d.data.isCurrentDay) {
              fillColor = service.data.config.defaults.CURRENT_DAY_FILL_HIGHLIGHT;
            } else {
              fillColor = service.data.config.defaults.SEGMENT_FILL_HIGHLIGHT;
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
              textColor = service.data.config.defaults.EVENT_TEXT_HIGHLIGHT;
            } else if (d.data.isCurrentDay) {
              textColor = service.data.config.defaults.CURRENT_DAY_TEXT_HIGHLIGHT;
            } else {
              textColor = service.data.config.defaults.SEGMENT_TEXT_HIGHLIGHT;
            }
          }

          return textColor;
        });
    }

    function getStartIndex(index) {
      return service.data.config.calendar[index].startIndex;
    }

  }
};
