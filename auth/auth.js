const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).json({ message: "Not Authorized" });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json("Invalid Token");
    }
}

module.exports = auth;
