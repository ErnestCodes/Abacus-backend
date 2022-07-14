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
exports.findAdminUser = exports.validateAdminPassword = exports.createAdminUser = void 0;
const lodash_1 = require("lodash");
require("dotenv").config();
const admin_models_1 = __importDefault(require("../models/admin.models"));
function createAdminUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const adminUser = yield admin_models_1.default.create(input);
            return (0, lodash_1.omit)(adminUser.toJSON(), "password");
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.createAdminUser = createAdminUser;
function validateAdminPassword({ email, password, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminUser = yield admin_models_1.default.findOne({ email });
        if (!adminUser) {
            return false;
        }
        const isValid = yield adminUser.comparePassword(password);
        if (!isValid) {
            return false;
        }
        return (0, lodash_1.omit)(adminUser.toJSON(), "password");
    });
}
exports.validateAdminPassword = validateAdminPassword;
function findAdminUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return admin_models_1.default.findOne(query).lean();
    });
}
exports.findAdminUser = findAdminUser;
// console.log(process.env);
