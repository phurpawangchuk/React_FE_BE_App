const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({
            message: 'Not Autenticated.'
        })
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretkeyhere');
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Not autenticated.'
        })
    }

    if (!decodedToken) {
        return res.status(401).json({
            message: 'Not autenticated.'
        })
    }
};