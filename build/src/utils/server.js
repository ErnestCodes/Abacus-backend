"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deserializeUser_1 = __importDefault(require("../middleware/deserializeUser"));
const routes_1 = __importDefault(require("../routes"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
function creatServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: config_1.default.get("origin"),
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(deserializeUser_1.default);
    (0, routes_1.default)(app);
    return app;
}
exports.default = creatServer;
