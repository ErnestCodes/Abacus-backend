"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_controller_1 = require("./controller/session.controller");
const admin_controller_1 = require("./controller/admin.controller");
const requireUser_1 = __importDefault(require("./middleware/requireUser"));
const validateResource_1 = __importDefault(require("./middleware/validateResource"));
const session_schema_1 = require("./schema/session.schema");
const admin_schema_1 = require("./schema/admin.schema");
const multer_1 = __importDefault(require("multer"));
const imageUpload_1 = require("./utils/imageUpload");
const product_controller_1 = require("./controller/product.controller");
const product_schema_1 = require("./schema/product.schema");
const userSession_controller_1 = require("./controller/userSession.controller");
const upload = (0, multer_1.default)({ storage: imageUpload_1.storage, fileFilter: imageUpload_1.fileFilter });
function routes(app) {
    // Performance and healthcheck
    app.get("/healthcheck", (req, res) => {
        res.sendStatus(200);
    });
    // Create User route
    app.post("/api/users", (0, validateResource_1.default)(admin_schema_1.createAdminUserSchema), admin_controller_1.createAdminUserHandler);
    app.get("/api/me", requireUser_1.default, admin_controller_1.getCurrentUser);
    // Session
    app.post("/api/sessions", (0, validateResource_1.default)(session_schema_1.createUserSessionSchema), session_controller_1.createAdminUserSessionHandler);
    app.get("/api/sessions", requireUser_1.default, session_controller_1.getAdminUserSessionHandler);
    app.delete("/api/sessions", requireUser_1.default, session_controller_1.deleteAdminSessionHandler);
    // OAuth
    app.get("/api/sessions/oauth/google", userSession_controller_1.googleOauthHandler);
    // Products
    app.post("/api/products", [
        // upload.single("image"),
        requireUser_1.default,
        (0, validateResource_1.default)(product_schema_1.createProductSchema),
    ], product_controller_1.createProductHandler);
    app.get("/api/products", product_controller_1.getAllProducts);
    app.put("/api/products/:productId", [
        upload.single("image"),
        requireUser_1.default,
        (0, validateResource_1.default)(product_schema_1.updateProductSchema),
    ], product_controller_1.updateProductHandler);
    app.get("/api/products/:productId", (0, validateResource_1.default)(product_schema_1.getProductSchema), product_controller_1.getProductHandler);
    app.delete("/api/products/:productId", [requireUser_1.default, (0, validateResource_1.default)(product_schema_1.deleteProductSchema)], product_controller_1.deleteProductHandler);
}
exports.default = routes;
