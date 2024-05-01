const jwt = require('jsonwebtoken');

const renewToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("I am in  renewToken ==", refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: 'No Refresh token' });
    }

    jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Refresh Token' });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ email: decoded.email },
            'secretkeyhere',
            { expiresIn: '5m' });

        console.log("Renewed access token: ", accessToken);

        // Set the new access token in the response cookies
        res.cookie('accessToken', accessToken, { maxAge: 300000 });

        // Continue with the request processing
        next();
    });
};

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Not Authenticated.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, 'secretkeyhere');
        next();
    } catch (error) {
        // If access token is expired, try to renew it
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            console.log("Access token expired or invalid. Attempting to renew...");
            return renewToken(req, res, next);
        } else {
            return res.status(401).json({ message: 'Not Authenticated.' });
        }
    }
};

module.exports = isAuth;
