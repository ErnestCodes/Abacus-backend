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
exports.deleteProductHandler = exports.getProductHandler = exports.getAllProducts = exports.updateProductHandler = exports.createProductHandler = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const product_service_1 = require("../service/product.service");
function createProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        // const image = req.file;
        //   console.log(image);
        // if (image == undefined) return res.send("image is not defined");
        try {
            const product = yield (0, product_service_1.createProduct)(Object.assign(Object.assign({}, body), { adminUser: res.locals.user._id }));
            return res.send(product);
        }
        catch (error) {
            return res.status(404);
        }
        //   const body = {
        //       title: req.body.title,
        //       description: req.body.description,
        //       price: req.body.price,
        //       image: req.files as { [fieldname: string]: Express.Multer.File[] },
        //       category: req.body.category
        //   };
    });
}
exports.createProductHandler = createProductHandler;
function updateProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const productId = req.params.productId;
        const image = req.file;
        const body = req.body;
        const update = Object.assign(Object.assign({}, body), { image });
        const product = yield (0, product_service_1.findProduct)({ productId });
        if (image == undefined)
            return res.send("image is not defined");
        if (!product) {
            return res.sendStatus(404);
        }
        if (String(product === null || product === void 0 ? void 0 : product.adminUser) !== userId) {
            return res.sendStatus(403);
        }
        const updateProduct = yield (0, product_service_1.findAndUpdateProduct)({ productId }, update, {
            new: true,
        });
        return res.send(updateProduct);
    });
}
exports.updateProductHandler = updateProductHandler;
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield product_model_1.default.find();
            // console.log(products);
            return res.send(products);
        }
        catch (error) {
            console.log(error.message);
        }
    });
}
exports.getAllProducts = getAllProducts;
function getProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.params.productId;
        const product = yield (0, product_service_1.findProduct)({ productId });
        if (!product) {
            return res.sendStatus(404);
        }
        return res.send(product);
    });
}
exports.getProductHandler = getProductHandler;
function deleteProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const productId = req.params.productId;
        // console.log(productId);
        // const product = await ProductModel.findById(productId);
        const product = yield (0, product_service_1.findProduct)({ productId });
        if (!product) {
            return res.sendStatus(404);
        }
        if (String(product === null || product === void 0 ? void 0 : product.adminUser) !== userId) {
            console.log("users do not match");
            return res.sendStatus(403);
        }
        yield (0, product_service_1.deleteProduct)({ productId });
        return res.status(200).send("Product deleted");
    });
}
exports.deleteProductHandler = deleteProductHandler;
