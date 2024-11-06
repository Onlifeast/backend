import { verifyToken } from "../utils/jwtUtils.js";
export function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.body.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
