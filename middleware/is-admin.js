const User = require("../models/user")

module.exports = async (req, res, next) => {
    const id = req.userId;
    const user = await User.findById(id);
    if (user.role !== "admin") {
        const error = new Error("Forbidden!");
        error.statusCode = 403;
        throw error;
    }
    next();
}

//TODO: Put better error handling