const { transports, format } = require('winston');
const { timestamp, json, errors } = format;
const expressWinston = require('express-winston');

const prodLogger = () => {
    return expressWinston.logger({
        transports: [
            new transports.File({ filename: 'error.log', level: 'error' }),
            new transports.File({ filename: 'combined.log' }),
        ],
        format: format.combine(
            timestamp(),
            errors({ stack: true }),
            json(),
        ),
        meta: true, 
        msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, 
        colorize: false, 
      });
}

module.exports = prodLogger;