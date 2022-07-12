import supertest from "supertest";
import createServer from "../src/utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createProduct } from "../src/service/product.service";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const productPayload = {
  user: userId,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "Created for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  price: "50",
  category: "Furniture",
  image: {
    fieldname: "image",
    originalname: "DSC00934.JPG",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination:
      "C:\\Users\\HP\\Documents\\Emeksthecreator\\Node-dev\\Aries\\server\\src\\utils\\uploads",
    filename: "DSC00934.JPG",
    path: "C:\\Users\\HP\\Documents\\Emeksthecreator\\Node-dev\\Aries\\server\\src\\utils\\uploads\\DSC00934.JPG",
    size: 7442162,
  },
};

describe("product", () => {
  beforeAll(async () => {
    // starts an instance of mongoDB inMemory
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        const productId = "product-123";
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        const product = await createProduct(productPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });
});
