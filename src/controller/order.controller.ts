import { Request, Response } from "express";
import { findAndUpdateUser } from "../service/user.service";
import log from "../utils/logger";

export const createOrderHandler = async (req: Request, res: Response) => {
  const { items, user } = req.body;

  // log.info(items[0].user.email);

  try {
    const orders = await findAndUpdateUser(
      { email: items[0].user.email },
      { orders: items },
      { new: true }
    );

    log.info(orders);

    return res.send(orders);
  } catch (error: any) {
    log.error(error.message);
    return res.status(404);
  }
};
