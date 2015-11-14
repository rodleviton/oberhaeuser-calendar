 export default calendarViewComponent => {

   calendarViewComponent.controller('CalendarController', CalendarController);

   CalendarController.$inject = ['$log', '$rootScope', '$stateParams', '$document', '$timeout', '$window', 'GapiService', 'ChartService'];

   /* @ngInject */
   function CalendarController($log, $rootScope, $stateParams, $document, $timeout, $window, GapiService, ChartService) {
     var vm = this;
     var DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0];

     vm.activeYear = $stateParams.year || 2015;
     vm.activate = activate;
     vm.getCalendar = getCalendar;
     vm.getTheme = getTheme;
     vm.getHolidays = getHolidays;
     vm.getStartDay = getStartDay;
     vm.getDaysInFebruary = getDaysInFebruary;
     vm.getCurrentDay = getCurrentDay;
     vm.theme = vm.getTheme();

     vm.activate();

     /////////////////////////////////////

     function getDaysInFebruary(year) {
       return new Date(year, 2, 0).getDate();
     }

     function getStartDay(month, year) {
       return new Date(year, month, 0).getDay();
     }

     function getCurrentDay() {
       var today = new Date();
       var dd = today.getDate();
       var mm = today.getMonth() + 1;
       var yyyy = today.getFullYear();

       return (yyyy + '-' + mm + '-' + dd);
     }

     function getCalendar() {
       var calendar = require('./config/calendar.json');

       // Calculate start day index of month
       angular.forEach(calendar, function (item, index) {
         item.startIndex = vm.getStartDay(index, vm.activeYear);
       });

       // Calculate days in February
       calendar[1].days = vm.getDaysInFebruary(vm.activeYear);

       // merge theme
       angular.forEach(vm.theme.months, function (item, index) {
         angular.extend(calendar[index], item);
       });

       return calendar;
     }

     function getTheme() {
       var themes = ['2013', '2015'];
       var theme = '2015';
       var currentYear = String(vm.activeYear);

       if (themes.indexOf(currentYear) > -1) {
         theme = currentYear;
       }

       // Add class to body
       var body = angular.element($document[0].body);
       body.removeAttr('class');
       body.addClass('theme-' + theme);

       return require('./config/themes/theme-' + theme + '.json');
     }

     function getHolidays() {
       return require('./config/events.json');
     }

     function activate() {
       vm.stampConfig = vm.theme.stamp;

       vm.config = {
         calendar: vm.getCalendar(),
         defaults: vm.theme.defaults,
         year: vm.activeYear,
         events: vm.getHolidays(),
         currentDate: vm.getCurrentDay()
       };
     }

     $window.initGapi = function () {
       GapiService.checkAuth().then(function (response) {
         // Broadcast this incase a view is waiting for the data
         $rootScope.$broadcast('GAPI_AUTHENTICATED');
       });
     };

   }
 };
