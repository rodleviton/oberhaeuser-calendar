export default 'common.utilities';

const commonUtilities = angular.module('common.utilities', []);

require('./utilities.service')(commonUtilities);
