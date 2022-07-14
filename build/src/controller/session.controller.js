"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminSessionHandler = exports.getAdminUserSessionHandler = exports.createAdminUserSessionHandler = void 0;
const session_service_1 = require("../service/session.service");
const admin_service_1 = require("../service/admin.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const config_1 = __importDefault(require("config"));
const admin_models_1 = __importDefault(require("../models/admin.models"));
const accessTokenCookieOptions = {
    maxAge: 900000,
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "lax",
    secure: false,
};
const refreshTokenCookieOptions = Object.assign(Object.assign({}, accessTokenCookieOptions), { maxAge: 3.154e10 });
function createAdminUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate d users password
        const user = yield (0, admin_service_1.validateAdminPassword)(req.body);
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        // create a session
        const session = yield (0, session_service_1.createSession)(user._id, req.get("user-agent") || "");
        const adminData = yield admin_models_1.default.findById(user._id);
        if (!adminData) {
            res.status(400);
            throw new Error("User not found");
        }
        // create an access token
        const accessToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), {
            expiresIn: config_1.default.get("accessTokenTtl"), // 15 minutes
        });
        //   create a refresh token
        const refreshToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), {
            expiresIn: config_1.default.get("refreshTokenTtl"), // 15 minutes
        });
        // set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
        // return access and refresh token
        return res.status(200).send({ accessToken, refreshToken, adminData });
    });
}
exports.createAdminUserSessionHandler = createAdminUserSessionHandler;
function getAdminUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const sessions = yield (0, session_service_1.findSessions)({ user: userId, valid: true });
        return res.send(sessions);
    });
}
exports.getAdminUserSessionHandler = getAdminUserSessionHandler;
function deleteAdminSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionId = res.locals.user.session;
        yield (0, session_service_1.updateSession)({ query: { _id: sessionId }, update: { valid: false } });
        return res.send({
            accessToken: null,
            refreshToken: null,
        });
    });
}
exports.deleteAdminSessionHandler = deleteAdminSessionHandler;
