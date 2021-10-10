'use strict';

const winston = require('winston');
const morgan = require('morgan');
const moment = require('moment');

const morganFormat = ':date[iso] - /:method :url HTTP/:http-version :status :response-time ms - :res[content-length]';
const env = process.env.NODE_ENV;

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            timestamp: moment(),
            level: 'silly',
            colorize: true
        })
    ]
});

function Log(app) {
    if (env !== 'test') {
        app.use(morgan(morganFormat));
    }
}

Log.show = (level, message) => {
    if (env !== 'test') {
        logger.log(level, message);
    }
};

Log.e = message => Log.show('error', message);
Log.w = message => Log.show('warn', message);
Log.i = message => Log.show('info', message);
Log.v = message => Log.show('verbose', message);
Log.d = message => Log.show('debug', message);
Log.s = message => Log.show('silly', message);

module.exports = Log;