export default calendarViewComponent => {

  calendarViewComponent.factory('GapiService', GapiService);

  GapiService.$inject = ['$log', '$q', '$http', '$timeout', 'gapi', 'ChartService'];

  /* @ngInject */
  function GapiService($log, $q, $http, $timeout, gapi, ChartService) {
    // Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '451796313513-n4skb1dln59pq6ganshqtq9a5gecm1ua.apps.googleusercontent.com';

    var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

    var service = {
      data: {
        isAuthorised: false
      },
      checkAuth: checkAuth,
      getEvents: getEvents
    };

    return service;

    /**
     * Check if current user has authorized this application.
     */
    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
      var deferred = $q.defer();

      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, function (authResult) {
        handleAuthResult(authResult).then(function (response) {
          loadCalendarApi(response).then(function(response) {
            service.data.isAuthorised = true;
            deferred.resolve(response);
          });
        }, function (error) {
          deferred.reject(error);
        });
      });

      return deferred.promise;
    }

    /**
     * Handle response from authorization server.
     * @param  {[type]} authResult [description]
     * @return {[type]}            [description]
     */
    function handleAuthResult(authResult) {
      var deferred = $q.defer();

      if (authResult && !authResult.error) {
        deferred.resolve(authResult);
      } else {
        gapi.auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: false
        }, function (response) {
          deferred.resolve(response);
        });
      }

      return deferred.promise;
    }

    /**
     * Load Google Calendar client library. List upcoming events
     * once client library is loaded.
     */
    function loadCalendarApi(authResult) {
      var deferred = $q.defer();

      gapi.client.load('calendar', 'v3', function () {
        deferred.resolve(authResult);
      });

      return deferred.promise;
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function getEvents(fromDate, toDate) {
      var deferred = $q.defer();

      var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date(fromDate)).toISOString(),
        'timeMax': (new Date(toDate)).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      });

      request.execute(function (resp) {
        var events = resp.items;

        deferred.resolve(events);

      });

      return deferred.promise;
    }

  }
};
