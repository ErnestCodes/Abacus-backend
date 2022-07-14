"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUserSchema = void 0;
const zod_1 = require("zod");
exports.createAdminUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({ required_error: "Email is required" }).email("Not a valid email"),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(6, "Password should be 6 chars minimum"),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "Password confirm is required",
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
});
