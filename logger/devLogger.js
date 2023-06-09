const { transports, format } = require('winston');
const { timestamp, errors, simple } = format;
const expressWinston = require('express-winston');

const devLogger = () => {
    return expressWinston.logger({
        transports: [
          new transports.Console()
        ],
        format: format.combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            simple()
        ),
        meta: false, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
      });
}

module.exports = devLogger;