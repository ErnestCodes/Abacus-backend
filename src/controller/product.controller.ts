import { Request, Response } from "express";
import AdminModel from "../models/admin.models";
import ProductModel from "../models/product.model";
import {
  CreateProductInput,
  DeleteProductInput,
  ReadProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../service/product.service";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  const body = req.body;
  // const image = req.file;
  //   console.log(image);
  // if (image == undefined) return res.send("image is not defined");
  try {
    const product = await createProduct({
      ...body,
      adminUser: res.locals.user._id,
    });

    return res.send(product);
  } catch (error: any) {
    return res.status(404);
  }

  //   const body = {
  //       title: req.body.title,
  //       description: req.body.description,
  //       price: req.body.price,
  //       image: req.files as { [fieldname: string]: Express.Multer.File[] },
  //       category: req.body.category
  //   };
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;
  const image = req.file;
  const body = req.body;
  const update = { ...body, image };

  const product = await findProduct({ productId });

  if (image == undefined) return res.send("image is not defined");

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product?.adminUser) !== userId) {
    return res.sendStatus(403);
  }

  const updateProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });

  return res.send(updateProduct);
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await ProductModel.find();
    // console.log(products);
    return res.send(products);
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getProductHandler(
  req: Request<ReadProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}

export async function deleteProductHandler(
  req: Request<DeleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;
  // console.log(productId);

  // const product = await ProductModel.findById(productId);
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product?.adminUser) !== userId) {
    console.log("users do not match");
    return res.sendStatus(403);
  }

  await deleteProduct({ productId });

  return res.status(200).send("Product deleted");
}
