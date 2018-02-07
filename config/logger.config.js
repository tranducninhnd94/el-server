var fs = require('fs');
var winston = require('winston');
require('winston-daily-rotate-file');

var logDir = './log';


if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: Date.now(),
            colorize: true,
            level: 'info'
        }),
        new (winston.transports.DailyRotateFile)({
            timestamp: Date.now(),
            filename: `${logDir}/-log.log`,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: 'debug'
        })
    ]
});

module.exports = logger;