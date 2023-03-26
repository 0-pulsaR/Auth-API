let logger = null;

if (process.env.NODE_ENV === 'dev') {
    logger = require('./devLogger');
} else {
    logger = require('./prodLogger');
}

module.exports = logger;