"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));

const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const exam_routes_1 = __importDefault(require("./routes/exam.routes"));
const submission_routes_1 = __importDefault(require("./routes/submission.routes"));
const codeExecution_routes_1 = __importDefault(require("./routes/codeExecution.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));

const error_middleware_1 = require("./middlewares/error.middleware");

function createApp(corsOrigin = "*") {
    const app = (0, express_1.default)();

    // Disable ETag
    app.set("etag", false);

    // Middleware
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json({ limit: "1mb" }));

    const corsOptions =
        corsOrigin === "*" ?
        { origin: true } :
        { origin: corsOrigin.split(",").map((o) => o.trim()), credentials: true };

    app.use((0, cors_1.default)(corsOptions));

    if (process.env.NODE_ENV === "production") {
        app.use((0, morgan_1.default)("combined"));

        app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
        }));
    } else {
        app.use((0, morgan_1.default)("dev"));
    }

    // Routes
    app.use("/api/auth", auth_routes_1.default);
    app.use("/api/admin", admin_routes_1.default);
    app.use("/api/admins", admin_routes_1.default);
    app.use("/api/exams", exam_routes_1.default);
    app.use("/api/submissions", submission_routes_1.default);
    app.use("/api/code", codeExecution_routes_1.default);

    // Health check (IMPORTANT for testing)
    app.get("/api/health", (_req, res) => {
        const dbState = mongoose_1.default.connection.readyState;

        res.status(200).json({
            status: dbState === 1 ? "ok" : "degraded",
        });
    });

    // Error handler
    app.use(error_middleware_1.errorHandler);

    return app;
}

exports.default = createApp;