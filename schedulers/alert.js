const { Subject, observeOn, asyncScheduler } = require("rxjs");
const { Check } = require("../models/Check");
const email = require("../notifiers/email");
const logger = require("../notifiers/logger");
const webhook = require("../notifiers/webhook");

/** @type {Subject<Check>} */
const alert = new Subject();

const async_alert = alert.pipe(observeOn(asyncScheduler));

const errorMessage = (src, err) => console.error(`${src} error`, err.name, this.error.message);

async_alert.subscribe({ next: email, error: err => errorMessage('email', err) });
async_alert.subscribe({ next: webhook, error: err => errorMessage('webhook', err) });
async_alert.subscribe({ next: logger, error: err => errorMessage('logger', err) });

module.exports = alert;
