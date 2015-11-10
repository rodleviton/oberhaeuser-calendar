/* jslint bitwise: true */
export default chartRing => {

  var d3 = require('d3');

  chartRing.$inject = ['$timeout', '$log', '$window', 'moment'];

  chartRing.directive('chartRing', ($timeout, $log, $window, moment) => {

    // Usage:
    // <chart-ring></chart-ring>

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
      var offset = 22;
      var tip;
      var arc;
      var pie;
      var chartRing;
      var width = BASE_UNIT;
      var height = BASE_UNIT;
      var innerRadius = ((BASE_UNIT / 2) - 20);
      var outerRadius = (BASE_UNIT / 2);

      function setup() {

        // Chart
        configureDataset();
        createChartRing();

        // // Animations
        animateIn(chartRing);
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
      }

      function configureSegments(month, index) {
        var currentDayIndex = month.startIndex;

        for (var i = 0; i <= TOTAL_SEGMENTS; i++) {

          // Local vars
          var segmentColor = 'none';
          var segmentLabel = '';
          var isActive = false;
          var itemDate = '';

          if (i < month.startIndex) {
            // Shade offset segments same color as chartRing
            segmentColor = COLOR_FOREGROUND;

          } else if (i < (month.days + month.startIndex)) {
            isActive = true;
            itemDate = (scope.config.year + '-' + (month.index + 1) + '-' + ((i + 1) - month.startIndex));

            // Determine if current segments are Saturday or Sunday
            // and shade accordingly
            if ((currentDayIndex === (DAYS_OF_WEEK - 2)) || (currentDayIndex === (DAYS_OF_WEEK - 1))) {
              segmentColor = shadeColor(month.color, -0.5);
            } else {
              segmentColor = month.color;
            }

            // Days of week iterator
            if (currentDayIndex === (DAYS_OF_WEEK - 1)) {
              currentDayIndex = 0;
            } else {
              currentDayIndex++;
            }

            angular.forEach(scope.config.events, function (item, index) {
              if (itemDate === moment(item.date).format('YYYY-M-D')) {
                segmentColor = '#fff';
              }
            });

            if (itemDate === scope.config.currentDate) {
              segmentColor = '#000';
            }

            segmentLabel = getSegmentLabel(i);

          } else if (i <= DISPLAY_SEGMENTS) {
            segmentColor = COLOR_FOREGROUND;
          }

          dataset[index].push({
            count: (100 / 40),
            isActive: isActive,
            color: segmentColor,
            label: segmentLabel,
            date: itemDate
          });

        }
      }

      ///////////////////////////////////////////////////////////
      // CREATE CHART
      ///////////////////////////////////////////////////////////

      function createChartRing() {
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
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // Add chart segments to newly created ring
        addChartSegments();
      }

      function addChartSegments() {
        angular.forEach(dataset, function (month, index) {

          innerRadius -= offset;
          outerRadius -= offset;

          var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

          var group = d3.select(element[0]).select('g')
            .append('g')
            .attr('class', 'chart-ring');

          // Configure segment colour
          var segments = group.selectAll('path')
            .data(pie(month))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('class', function (d, i) {
              return 'segment-' + (i + 1);
            })
            .attr('fill', function (d) {
              return d.data.color;
            })
            .on('mouseover', function (d) {
              if (d.data.isActive) {
                focusRow(this, true);
                focusLabel(this, d, true);
                focusSegment(this, true);
              }
            })
            .on('mouseout', function (d) {
              if (d.data.isActive) {
                focusRow(this, false);
                focusLabel(this, d, false);
              }
            });

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
            .attr('fill', scope.config.calendar[index].color)
            .text(function (d, i) {
              return MONTH_LABELS[d];
            });

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
            .style('fill', '#fff')
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

        });
      }

      ///////////////////////////////////////////////////////////
      // ANIMATIONS
      ///////////////////////////////////////////////////////////

      /**
       * Animate chart ring into view
       */
      function animateIn(element) {
        element.selectAll('.chart-ring')
          .style('opacity', 0)
          .transition()
          .duration(DURATION)
          .delay(function (d, i) {
            return (DELAY + (i * 100));
          })
          .style('opacity', 1);
      }

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

      function getSegmentLabel(index) {
        return 'segment-label-' + index;
      }

      function focusSegment(segment, isFocused) {
        d3.select(segment).transition()
          .duration(150)
          .attr('fill', function (d, i) {
            return isFocused ? '#fff' : d.data.color;
          });
      }

      function focusRow(segment, isFocused) {
        d3.select(segment.parentNode)
          .selectAll('path')
          .transition()
          .duration(150)
          .attr('fill', function (d, i) {
            var fillColour = d.data.color;

            if (d.data.isActive && isFocused) {
              fillColour = shadeColor(d.data.color, -0.5);
            }

            return fillColour;
          });
      }

      function focusLabel(segment, item, isFocused) {
        var fillColor = isFocused ? '#000' : '#fff';

        d3.select(segment.parentNode)
          .select('g.' + item.data.label)
          .select('text')
          .style('fill', fillColor);
      }

      // Initialise chart ring
      setup();
    }
  });
};
