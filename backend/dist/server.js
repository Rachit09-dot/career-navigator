"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const career_1 = __importDefault(require("./routes/career"));
const skillGap_1 = __importDefault(require("./routes/skillGap"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const applications_1 = __importDefault(require("./routes/applications"));
const resume_1 = __importDefault(require("./routes/resume"));
const chat_1 = __importDefault(require("./routes/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security
app.use((0, helmet_1.default)());
// Rate limiters
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { message: 'Too many requests, please try again later.' },
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    message: { message: 'Too many auth attempts, please wait a minute.' },
});
app.use(globalLimiter);
// CORS (production safe)
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ ROOT ROUTE (VERY IMPORTANT for Railway)
app.get('/', (_req, res) => {
    res.send('Server is running 🚀');
});
// Routes
app.use('/api/auth', authLimiter, auth_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/career', career_1.default);
app.use('/api/skill-gap', skillGap_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/resume', resume_1.default);
app.use('/api/chat', chat_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'CareerNavigator API is running',
        timestamp: new Date().toISOString()
    });
});
// Error handling
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔒 Security: Helmet + Rate Limiting enabled`);
});
exports.default = app;
