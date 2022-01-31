const { Subject, observeOn, asyncScheduler } = require("rxjs");
const { Check } = require("../models/Check");
const email = require("../notifiers/email");
const logger = require("../notifiers/logger");
const webhook = require("../notifiers/webhook");

/** @type {Subject<Check>} */
const alert = new Subject();

const async_alert = alert.pipe(observeOn(asyncScheduler));

async_alert.subscribe({ next: email, error: err => console.error('email error') });
async_alert.subscribe({ next: webhook, error: err => console.error('webhook error') });
async_alert.subscribe({ next: logger, error: err => console.error('logger error') });

module.exports = alert;
