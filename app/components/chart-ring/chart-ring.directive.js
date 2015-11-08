/* jslint bitwise: true */

export default chartRing => {

  var d3 = require('d3');

  chartRing.$inject = ['$timeout', '$log'];

  chartRing.directive('chartRing', ($timeout, $log) => {

    // Usage:
    // <chart-ring></chart-ring>

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        config: '=',
        index: '='
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
      var BASE_UNIT = 920;

      // VARS
      var totalOffset = MAX_DAYS - scope.config.days;
      var startOffset = scope.config.startIndex;
      var segement = (100 / TOTAL_SEGMENTS);
      var dayOfWeekIndex = startOffset;
      var currentDay = 0;
      var dataset = [];
      var chartRing;
      var pie;
      var arc;
      var offset = ((scope.index + 1) * 22);
      var width = BASE_UNIT - offset;
      var height = BASE_UNIT - offset;
      var radius = Math.min(width, height) / 2;
      var innerRadius = ((BASE_UNIT / 2) - 20) - offset;
      var outerRadius = (BASE_UNIT / 2) - offset;
      var t = 2 * Math.PI;

      function setup() {
        // Chart
        configureDataset();

        createBackgroundChartRing();
        addBackgroundChartSegments();
        createChartRing();
        addChartSegments();

        // Text
        addMonthLabel();
        addDayLabelTextPath();
        addDayLabel();

        // Animations
        animateIn(chartRing);
      }

      ///////////////////////////////////////////////////////////
      // CONFIGURATION
      ///////////////////////////////////////////////////////////

      /**
       * Configure calendar dataset
       */
      function configureDataset() {
        for (var i = 0; i <= TOTAL_SEGMENTS; i++) {
          if (i < startOffset) {
            // Shade offset segments same color as chartRing
            dataset.push({
              count: (100 / 40),
              color: COLOR_FOREGROUND
            });
          } else if (i < (scope.config.days + startOffset)) {
            // Apply color to days of month segments
            var segmentColor;

            // Determine if current segments are Saturday or Sunday
            // and shade accordingly
            if ((dayOfWeekIndex === (DAYS_OF_WEEK - 2)) || (dayOfWeekIndex === (DAYS_OF_WEEK - 1))) {
              segmentColor = shadeColor(scope.config.color, -0.5);
            } else {
              segmentColor = scope.config.color;
            }

            // Days of week iterator
            if (dayOfWeekIndex === (DAYS_OF_WEEK - 1)) {
              dayOfWeekIndex = 0;
            } else {
              dayOfWeekIndex++;
            }

            dataset.push({
              count: (100 / 40),
              color: segmentColor
            });
          } else if (i <= DISPLAY_SEGMENTS) {
            dataset.push({
              count: (100 / 40),
              color: COLOR_FOREGROUND
            });
          } else {
            // Do not configure any fill color for
            // segments beyond days in month
            dataset.push({
              count: (100 / 40),
              color: 'none'
            });
          }
        }

      }

      ///////////////////////////////////////////////////////////
      // CREATE CHART
      ///////////////////////////////////////////////////////////

      function createChartRing() {
        angular.element(element).addClass('calendar-chart-ring');
        angular.element(element).css('margin-left', (offset / 2) + 'px');
        angular.element(element).css('margin-top', (offset / 2) + 'px');

        arc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);

        pie = d3.layout.pie()
          .padAngle(0.005)
          .value(function (d) {
            return d.count;
          }).sort(null);

        chartRing = d3.select(element[0]).append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      }

      function addChartSegments() {
        chartRing.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('class', 'chartRing')
          .attr('fill', function (d) {
            return d.data.color;
          });
          // .on('mouseover', function(d) {
          //   console.log(this);
          //   d3.select(this).transition()
          //     .duration(100)
          //     .attr('fill', '#fff');
          // })
          // .on('mouseout', function(d) {
          //   d3.select(this).transition()
          //     .duration(100)
          //     .attr('fill', function (d) {
          //       return d.data.color;
          //     })
          // });
      }

      var backgroundArc;
      var backgroundPie;
      var backgroundChartRing;

      function createBackgroundChartRing() {
        angular.element(element).addClass('calendar-chart-ring');

        backgroundArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);

        backgroundPie = d3.layout.pie()
          .padAngle(0.005)
          .value(function (d) {
            return d.count;
          }).sort(null);

        backgroundChartRing = d3.select(element[0]).append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      }

      function addBackgroundChartSegments() {
        backgroundChartRing.selectAll('path')
          .data(backgroundPie(dataset))
          .enter()
          .append('path')
          .attr('d', backgroundArc)
          .attr('class', 'backgroundChartRing')
          .attr('fill', function(d, i) {
            var fillColor = 'none';
            if (i <= DISPLAY_SEGMENTS) {
              fillColor = COLOR_FOREGROUND;
            }

            return fillColor;
          });
      }

      ///////////////////////////////////////////////////////////
      // TEXT PATHS
      ///////////////////////////////////////////////////////////
      function addMonthLabel() {
        // Append label group
        chartRing.append('g')
          .attr('class', 'labels');

        // Configure label
        chartRing.select('.labels').selectAll('text')
          .data([scope.config.name])
          .enter()
            .append('text')
            .attr('dx', '-20')
            .style('text-anchor', 'end')
            .attr('dy', (outerRadius * -1) + 13) // vertical-align
            .attr('fill', scope.config.color)
            .text(scope.config.name);
      }

      function addDayLabelTextPath() {
        chartRing.selectAll('path')
        .each(function (d, i) {
          //Search pattern for everything between the start and the first capital L
          var firstArcSection = /(^.+?)L/;

          //Grab everything up to the first Line statement
          var newArc = firstArcSection.exec(d3.select(this).attr('d'))[1];

          //Replace all the comma's so that IE can handle it
          newArc = newArc.replace(/,/g, ' ');

          //Create a new invisible arc that the text can flow along
          chartRing.append('path')
            .attr('id', 'chartRing' + scope.config.name + i)
            .attr('d', newArc)
            .style('fill', 'none');
        });
      }

      // Append the label
      function addDayLabel() {
        chartRing.selectAll('.chartDay')
          .data(pie(dataset))
          .enter().append('text')
          .attr('class', 'chartDay')
          .attr('dy', 13) //Move the text down
          .append('textPath')
          .attr('startOffset', '50%')
          .style('text-anchor', 'middle')
          .style('fill', '#fff')
          .attr('xlink:href', function (d, i) {
            return '#chartRing' + scope.config.name + i;
          })
          .text(function (d, i) {
            var text = '';

            if (i < startOffset) {
              text = '';
            } else if (i < (scope.config.days + startOffset)) {
              currentDay++;
              text = currentDay;
            } else if (i <= DISPLAY_SEGMENTS) {
              text = '';
            }

            return text;
          });
      }

      ///////////////////////////////////////////////////////////
      // ANIMATIONS
      ///////////////////////////////////////////////////////////

      /**
       * Animate chart ring into view
       */
      function animateIn(element) {
        element
            .style('opacity', 0)
            .transition()
            .duration(DURATION)
            .delay(DELAY + (scope.index * 100))
            .style('opacity', 1);
      }

      /**
       * Animate chart ring out of view
       */
      function animateOut(element) {
        element
            .style('opacity', 1)
            .transition()
            .duration(DURATION)
            .delay(DELAY + (scope.index * 100))
            .style('opacity', 0);
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

      // Initialise chart ring
      setup();
    }
  });
};
