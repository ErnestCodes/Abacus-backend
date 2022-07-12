import { Express, Request, Response } from "express";
import {
  createAdminUserSessionHandler,
  deleteAdminSessionHandler,
  getAdminUserSessionHandler,
} from "./controller/session.controller";
import {
  getCurrentUser,
  createAdminUserHandler,
} from "./controller/admin.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createUserSessionSchema } from "./schema/session.schema";
import { createAdminUserSchema } from "./schema/admin.schema";
import multer from "multer";
import { fileFilter, storage } from "./utils/imageUpload";
import {
  createProductHandler,
  deleteProductHandler,
  getAllProducts,
  getProductHandler,
  updateProductHandler,
} from "./controller/product.controller";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import { googleOauthHandler } from "./controller/userSession.controller";

const upload = multer({ storage: storage, fileFilter: fileFilter });

function routes(app: Express) {
  // Performance and healthcheck
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Create User route
  app.post(
    "/api/users",
    validateResource(createAdminUserSchema),
    createAdminUserHandler
  );

  app.get("/api/me", requireUser, getCurrentUser);

  // Session
  app.post(
    "/api/sessions",
    validateResource(createUserSessionSchema),
    createAdminUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getAdminUserSessionHandler);

  app.delete("/api/sessions", requireUser, deleteAdminSessionHandler);

  // OAuth
  app.get("/api/sessions/oauth/google", googleOauthHandler);

  // Products
  app.post(
    "/api/products",
    [
      // upload.single("image"),
      requireUser,
      validateResource(createProductSchema),
    ],
    createProductHandler
  );

  app.get("/api/products", getAllProducts);

  app.put(
    "/api/products/:productId",
    [
      upload.single("image"),
      requireUser,
      validateResource(updateProductSchema),
    ],
    updateProductHandler
  );

  app.get(
    "/api/products/:productId",
    validateResource(getProductSchema),
    getProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
