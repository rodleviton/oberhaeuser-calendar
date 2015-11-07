export default chartLabels => {

  var d3 = require('d3');

  chartLabels.$inject = ['$timeout'];

  chartLabels.directive('labels', ($timeout) => {

    // Usage:
    // <chart-labels></chart-labels>

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {},
      link: link
    };

    return directive;

    function link(scope, element, attrs) {

      var screenWidth = window.innerWidth;

      var margin = {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20
      };

      var width = 1100;
      var height = 1100;

      var DAYS_OF_WEEK = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ];

      element.addClass('calendar-chart-labels');
      angular.element(element).css('left', -50 + 'px');
      angular.element(element).css('top', -50 + 'px');

      var svg = d3.select(element[0]).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      //////////////////////////////////////////////////////////////
      ///////////////////// Data &  Scales /////////////////////////
      //////////////////////////////////////////////////////////////

      var donutData = [];
      var DISPLAY_SEGMENTS = 39; // Total segments to display on screen
      var TOTAL_SEGMENTS = 48;
      var dayOfWeekIndex = 0;

      for (var i = 0; i <= TOTAL_SEGMENTS; i++) {

        // Increment first and start calendar off at Monday
        if (dayOfWeekIndex < (DAYS_OF_WEEK.length - 1)) {
          dayOfWeekIndex++;
        } else {
          dayOfWeekIndex = 0;
        }

        donutData.push({
          name: (i <= DISPLAY_SEGMENTS) ? DAYS_OF_WEEK[dayOfWeekIndex] : '',
          value: (100 / 40)
        });
      }

      //Create an arc function
      var arc = d3.svg.arc()
        .innerRadius(480)
        .outerRadius(500);

      var pie = d3.layout.pie()
        .padAngle(0.005)
        .value(function (d) {
          return d.value;
        }).sort(null);

      //////////////////////////////////////////////////////////////
      //////////////////// Create Donut Chart //////////////////////
      //////////////////////////////////////////////////////////////

      //Create the donut slices and also the invisible arcs for the text
      svg.selectAll('.donutArcs')
        .data(pie(donutData))
        .enter().append('path')
        .attr('class', 'donutArcs')
        .attr('d', arc)
        .style('fill', 'none')
        .each(function (d, i) {
          //Search pattern for everything between the start and the first capital L
          var firstArcSection = /(^.+?)L/;

          //Grab everything up to the first Line statement
          var newArc = firstArcSection.exec(d3.select(this).attr('d'))[1];
          //Replace all the comma's so that IE can handle it
          newArc = newArc.replace(/,/g, ' ');

          //Create a new invisible arc that the text can flow along
          svg.append('path')
            .attr('class', 'hiddenDonutArcs')
            .attr('id', 'donutArc' + i)
            .attr('d', newArc)
            .style('fill', 'none');
        });

      //Append the label names on the outside
      svg.selectAll('.donutText')
        .data(pie(donutData))
        .enter().append('text')
        .attr('class', 'donutText')
        .append('textPath')
        .attr('startOffset', '50%')
        .style('text-anchor', 'middle')
        .style('fill', '#fff')
        .style('opacity', 0)
        .attr('xlink:href', function (d, i) {
          return '#donutArc' + i;
        })
        .text(function (d) {
          return d.data.name;
        })
        .transition()
        .duration(1500)
        .delay(1500)
        .style('opacity', 1);
    }
  });
};
