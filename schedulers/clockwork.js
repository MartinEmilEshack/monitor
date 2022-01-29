const { interval } = require('rxjs');

const clockwork = interval(5000);

module.exports = clockwork;