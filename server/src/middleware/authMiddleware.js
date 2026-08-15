const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    try {
        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // No token
        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token",
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // Attach user to request
        req.user = user;

        // Continue
        next();

    } catch (error) {
        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            message: "Not authorized, token failed",
        });
    }
};

module.exports = {
    protect,
};