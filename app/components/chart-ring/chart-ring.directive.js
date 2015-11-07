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
      template: require('./chart-ring.tmpl.html'),
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
      var TOTAL_SEGMENTS = 48;

      // VARS
      var totalOffset = MAX_DAYS - scope.config.days;
      var startOffset = scope.config.startIndex;
      var segement = (100 / TOTAL_SEGMENTS);
      var dayOfWeekIndex = startOffset;
      var currentDay = 0;
      var dataset = [];

      var foreground;
      var pie;
      var arc;
      var offset = ((scope.index + 1) * 22);
      var width = 1000 - offset;
      var height = 1000 - offset;
      var radius = Math.min(width, height) / 2;
      var innerRadius = 480 - offset;
      var outerRadius = 500 - offset;
      var t = 2 * Math.PI;

      function setup() {
        configureChart();
        createChartRings();
        createTextPaths();
        addMonthLabel();
        addDayLabel();
      }

      function configureChart() {
        for (var i = 0; i <= TOTAL_SEGMENTS; i++) {
          if (i < startOffset) {
            dataset.push({
              count: (100 / 40),
              color: COLOR_FOREGROUND
            });
          } else if (i < (scope.config.days + startOffset)) {

            var segmentColor;

            // Color
            if ((dayOfWeekIndex === (DAYS_OF_WEEK - 2)) || (dayOfWeekIndex === (DAYS_OF_WEEK - 1))) {
              segmentColor = shadeColor(scope.config.color, -0.25);
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
            dataset.push({
              count: (100 / 40),
              color: 'none'
            });
          }
        }

      }

      function createChartRings() {
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

        // Create the SVG container, and apply a transform such that the origin is the
        // center of the canvas. This way, we don't need to position arcs individually.
        foreground = d3.select(element[0]).append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      }

      /****************************************************/
      // ** LABELS ** //
      /****************************************************/

      function createTextPaths() {
        foreground.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('class', 'chartRing')
          .attr('fill', function (d) {
            return COLOR_FOREGROUND;
          })
          .each(function (d, i) {
            //Search pattern for everything between the start and the first capital L
            var firstArcSection = /(^.+?)L/;

            //Grab everything up to the first Line statement
            var newArc = firstArcSection.exec(d3.select(this).attr('d'))[1];

            //Replace all the comma's so that IE can handle it
            newArc = newArc.replace(/,/g, ' ');

            //Create a new invisible arc that the text can flow along
            foreground.append('path')
              .attr('class', 'hiddenChartRing')
              .attr('id', 'chartRing' + scope.config.name + i)
              .attr('d', newArc)
              .style('fill', 'none');
          })
          .transition()
          .duration(1500)
          .delay(1000 + (scope.index * 100))
          .attr('fill', function (d) {
            return d.data.color;
          });
      }

      function arcTween(finish) {
        var start = {
          startAngle: 0,
          endAngle: 0
        };
        var i = d3.interpolate(start, finish);
        return function (d) {
          return arc(i(d));
        };
      }

      function addMonthLabel() {
        foreground.append('g')
          .attr('class', 'labels');

        var text = foreground.select('.labels').selectAll('text')
          .data(pie(dataset));

        text.enter()
          .append('text')
          .attr('dx', '-20')
          .style('text-anchor', 'end')
          .attr('dy', (outerRadius * -1) + 13) // vertical-align
          .attr('fill', scope.config.color)
          .text(scope.config.name)
          .style('opacity', 0)
          .transition()
          .duration(1500)
          .delay(1000 + (scope.index * 100))
          .style('opacity', 1);
      }

      // Append the label
      function addDayLabel() {
        foreground.selectAll('.chartDay')
          .data(pie(dataset))
          .enter().append('text')
          .attr('class', 'chartDay')
          .attr('dy', 13) //Move the text down
          .append('textPath')
          .attr('transform', 'translate(73.7382973492235,97.82082346840828)')
          .attr('startOffset', '50%')
          .style('text-anchor', 'middle')
          .style('fill', '#fff')
          .style('opacity', 0)
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
          })
          .transition()
          .duration(1500)
          .delay(1000)
          .style('opacity', 1);
      }

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

      setup();
    }
  });
};
