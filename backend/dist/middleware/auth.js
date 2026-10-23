"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const secret = process.env.JWT_SECRET || 'careernavigator_secret_key_2024';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const rawUserId = decoded?.userId ?? decoded?.id ?? decoded?.sub;
        if (rawUserId === undefined || rawUserId === null || String(rawUserId).trim() === '') {
            return res.status(401).json({ message: 'Invalid token: user ID missing' });
        }
        req.userId = String(rawUserId);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
