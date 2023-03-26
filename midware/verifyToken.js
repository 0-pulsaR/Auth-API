const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const verifyCookieToken = (req, res, next) => {
    const authHeader = req.cookies.token;
    if (authHeader) {
        const decryptedToken = CryptoJS.AES.decrypt(authHeader, process.env.ENC_TOKEN_KEY).toString(CryptoJS.enc.Utf8);
        jwt.verify(decryptedToken, process.env.JWT_SEC, (err, user) => {
            if (err) return res.status(403).json('Token is not valid !'); 
            req.user = user;
            next();
        });
    } else return res.status(401).json('You are not authenticated !');
}; 

module.exports = { verifyCookieToken }