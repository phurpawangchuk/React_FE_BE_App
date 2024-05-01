const verifyToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken==", refreshToken);

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not found' });
    }

    jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
        if (err) {
            // Refresh token is expired or invalid
            // Generate new tokens
            const accessToken = jwt.sign({ email: decoded.email }, "secretkeyhere", { expiresIn: '1m' });
            const newRefreshToken = jwt.sign({ email: decoded.email }, "jwt-refresh-token-secret-key", { expiresIn: '5m' });

            res.cookie('accessToken', accessToken, { maxAge: 60000 });
            res.cookie('refreshToken', newRefreshToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });

            next();
        } else {
            // Refresh token is valid, continue with the request
            next();
        }
    });
};
module.exports = verifyToken;