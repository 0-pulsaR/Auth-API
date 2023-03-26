const verifyContentType = (req, res, next) => {
    if (req.get('Content-Type') !== 'application/json') return res.status(400).json('bad request');
    next();
} 

module.exports = verifyContentType;