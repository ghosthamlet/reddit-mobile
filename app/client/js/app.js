global.$ = global.jQuery = require('jQuery');

require('bootstrap');
require('embedly');

$(document).off('.collapse.data-api')

var Collapse = require('./components/collapse');
Collapse.bind('[data-toggle=collapse]');

