'use strict';

const log = require('./logger');

exports.data = (payload, res) => res.status(200).json(payload);

exports.dataStatus = (payload, status, res) => res.status(status).json(payload);

exports.message = (message, res) => exports.send(false, message, 200, res);

exports.messageStatus = (message, status, res) => exports.send(false, message, status, res);

exports.error = (message, res) => exports.send(true, message, 400, res);

exports.errorStatus = (message, status, res) => exports.send(true, message, status, res);

exports.errorReject = (reject, res) =>
    exports.send(true, reject.message || 'Internal server error', reject.status || 500, res);

exports.reject = message => {
    return {message, status: 400};
};

exports.rejectStatus = (message, status) => {
    return {message, status};
};

exports.send = (error, message, status, res) => {
    let data = {error, message, status};
    if (error) {
        log.e(JSON.stringify(message, null, 3));
    }
    res.status(status).json(data);
};