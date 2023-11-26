import BlacklistedToken from "../models/tokenSchema.js";

const checkBlacklistedToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken != null) {
        return res.sendStatus(401);
    }

    next();
};

export default checkBlacklistedToken;