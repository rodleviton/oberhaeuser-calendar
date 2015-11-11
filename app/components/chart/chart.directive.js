/* jslint bitwise: true */
export default chart => {

  var d3 = require('d3');

  chart.$inject = ['$timeout', '$log', '$window', '$state', 'lodash', 'moment', 'ChartService'];

  chart.directive('chart', ($timeout, $log, $window, $state, lodash, moment, ChartService) => {

    // Usage:
    // <chart></chart>

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        config: '='
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs) {

      // CONSTANTS
      var COLOR_BACKGROUND = '#29272c';
      var COLOR_FOREGROUND = '#333136';
      var DAYS_OF_WEEK = 7;
      var MAX_DAYS = 31;
      var DISPLAY_SEGMENTS = 39; // Total segments to display on screen
      var TOTAL_SEGMENTS = 48; // Total number of segments for each chart ring
      var DURATION = 1000;
      var DELAY = 1000;
      var BASE_UNIT = ($window.innerHeight > 1000) ? ($window.innerHeight - 100) : 1000;
      var t = 2 * Math.PI;
      var MONTH_LABELS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      // VARS
      var dataset = [];

      function setup() {
        // Make dataset available to service
        ChartService.setCalendarConfig(scope.config.calendar);
        ChartService.setChartConfig(dataset);
        ChartService.setEventsConfig(scope.config.events);

        // Chart
        configureDataset();
        Chart.create();

        // Animations
        Chart.animateIn();
      }

      ///////////////////////////////////////////////////////////
      // CONFIGURATION
      ///////////////////////////////////////////////////////////

      /**
       * Configure calendar dataset
       */
      function configureDataset() {
        angular.forEach(scope.config.calendar, function (month, index) {
          dataset[index] = []; // Add empty array at current month index
          configureSegments(month, index);
        });

        addMarkers();
      }

      function configureSegments(month, index) {
        var currentDayIndex = month.startIndex;

        for (var i = 0; i <= TOTAL_SEGMENTS; i++) {

          // Local vars
          var fillColor = 'none';
          var textColor = month.textColor;
          var segmentLabel = '';
          var isActive = false;
          var itemDate = '';

          if (i < month.startIndex) {
            // Shade offset segments same color as chartRing
            fillColor = COLOR_FOREGROUND;

          } else if (i < (month.days + month.startIndex)) {

            isActive = true;
            itemDate = getSegmentDate(i, month.index, month.startIndex);
            segmentLabel = getSegmentLabel(i);
            fillColor = getFillColor(currentDayIndex, month.fillColor);

            // Increment current day index
            currentDayIndex = getDayOfWeekIndex(currentDayIndex);
          } else if (i <= DISPLAY_SEGMENTS) {
            fillColor = COLOR_FOREGROUND;
          }

          dataset[index].push({
            count: (100 / 40),
            isActive: isActive,
            fillColor: fillColor,
            textColor: textColor,
            label: segmentLabel,
            date: new Date(itemDate),
            day: getDay(((i + 1) - month.startIndex)),
            month: getMonth((month.index + 1))
          });
        }
      }

      function addMarkers() {
        ChartService.markCurrentDay();
        ChartService.markEvents();
      }

      ///////////////////////////////////////////////////////////
      // CHART CREATION
      ///////////////////////////////////////////////////////////

      var Chart = (function () {
        var offset = 22;
        var arc;
        var pie;
        var width = BASE_UNIT;
        var height = BASE_UNIT;
        var chartRing;
        var innerRadius = ((BASE_UNIT / 2) - 20);
        var outerRadius = (BASE_UNIT / 2);

        function create() {
          // Calculate new values based on index
          width -= offset;
          height -= offset;

          pie = d3.layout.pie()
            .padAngle(0.005)
            .value(function (d) {
              return d.count;
            }).sort(null);

          chartRing = d3.select(element[0]).append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('margin-top', (offset / 2) + 'px')
            .style('margin-left', (offset / 2) + 'px')
            .attr('class', 'calendar-chart-ring')
            .attr('viewBox', '0 0 ' + width + ' ' + width)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            .call(addSegments);
        }

        function addSegments() {
          angular.forEach(dataset, function (month, index) {

            innerRadius -= offset;
            outerRadius -= offset;

            var arc = d3.svg.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);

            var group = d3.select(element[0]).select('g')
              .append('g')
              .attr('class', function (d, i) {
                return 'chart-ring chart-ring-' + index;
              });

            // Configure segment colour
            var segments = group.selectAll('path')
              .data(pie(month))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('class', function (d, i) {
                return 'segment segment-' + i;
              })
              .attr('fill', function (d) {
                return d.data.fillColor;
              })
              .on('mouseover', function (d) {
                if (d.data.isActive) {
                  var monthIndex = getMonthIndex(d.data.date);
                  var dayIndex = getDayIndex(d.data.date);
                  ChartService.focusEvent(monthIndex, dayIndex, true);
                }
              })
              .on('mouseout', function (d) {
                if (d.data.isActive) {
                  var monthIndex = getMonthIndex(d.data.date);
                  var dayIndex = getDayIndex(d.data.date);
                  ChartService.focusEvent(monthIndex, dayIndex, false);
                }
              })
              .on('click', function (d) {
                $state.go('calendar.day', {
                  day: d.data.day,
                  month: d.data.month
                });
              });

            addMonthLabels(group, index);
            addDayLabels(group, month, arc, index);
          });
        }

        function addMonthLabels(group, index) {
          // Configure month labels
          var monthLabels = group.selectAll('g.month-label')
            .data([scope.config.calendar[index].index])
            .enter()
            .append('g')
            .attr('class', 'month-label')
            .append('text')
            .style('text-anchor', 'end')
            .attr('dx', '-20')
            .attr('dy', (outerRadius * -1) + 13)
            .attr('fill', scope.config.calendar[index].fillColor)
            .text(function (d, i) {
              return MONTH_LABELS[d];
            });
        }

        function addDayLabels(group, month, arc, index) {
          // Configure day labels
          var dayLabels = group.selectAll('g.segment-label')
            .data(pie(month))
            .enter()
            .append('g')
            .attr('class', function (d, i) {
              return 'segment-label ' + getSegmentLabel(i);
            })
            .append('text')
            .attr('pointer-events', 'none')
            .attr('transform', function (d) {
              //set the label's origin to the center of the arc
              //we have to make sure to set these before calling arc.centroid
              d.outerRadius = outerRadius + 50;
              d.innerRadius = outerRadius + 45;
              return 'translate(' + arc.centroid(d) + ')';
            })
            .attr('text-anchor', 'middle')
            .attr('dy', 3)
            .style('fill', function (d, i) {
              return d.data.textColor;
            })
            .text(function (d, i) {
              var text = '';

              if (i < scope.config.calendar[index].startIndex) {
                text = '';
              } else if (i < (scope.config.calendar[index].days + scope.config.calendar[index].startIndex)) {
                text = ((i + 1) - (scope.config.calendar[index].startIndex));

                if (text < 10) {
                  text = '0' + text;
                }
              }

              return text;
            });
        }

        /**
         * Animate chart rings into view
         */
        function animateIn() {

          chartRing.selectAll('.chart-ring')
            .style('opacity', 0)
            .transition()
            .duration(DURATION)
            .delay(function (d, i) {
              return (DELAY + (i * 100));
            })
            .style('opacity', 1);
        }

        /**
         * Animate chart rings into view
         */
        function animateOut() {

          chartRing.selectAll('.chart-ring')
            .style('opacity', 1)
            .transition()
            .duration(DURATION)
            .delay(function (d, i) {
              return (DELAY + (i * 100));
            })
            .style('opacity', 0);
        }

        return {
          create: create,
          animateIn: animateIn,
          animateOut: animateOut
        };
      })();

      //////////////////////////////////////////////////////////////////////
      // HELPERS
      //////////////////////////////////////////////////////////////////////

      function getSegmentLabel(index) {
        return 'segment-label-' + index;
      }

      function getSegmentDate(index, itemIndex, startIndex) {
        return (scope.config.year + '-' + (itemIndex + 1) + '-' + ((index + 1) - startIndex));
      }

      function getDayOfWeekIndex(index) {
        // Days of week iterator
        if (index === (DAYS_OF_WEEK - 1)) {
          index = 0;
        } else {
          index++;
        }

        return index;
      }

      function getStartIndex(index) {
        return scope.config.calendar[index].startIndex;
      }

      /**
       * Determine if current segments are Saturday or Sunday
       * and shade accordingly
       */
      function getFillColor(index, color) {
        var fillColor = color;

        if ((index === (DAYS_OF_WEEK - 2)) || (index === (DAYS_OF_WEEK - 1))) {
          fillColor = shadeColor(color, -0.5);
        }

        return fillColor;
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

      function getDay(day) {
        return (day < 10) ? '0' + day : day;
      }

      function getMonth(month) {
        return (month < 10) ? '0' + month : month;
      }

      //////////////////////////////////////////////////////////////////////
      // INITIALISE CHART
      //////////////////////////////////////////////////////////////////////
      setup();
    }
  });
};
