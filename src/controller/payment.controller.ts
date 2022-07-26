import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Client, Environment } from "square";
import log from "../utils/logger";
// import { SQUARE_SANDBOX_TOKEN } from "../utils/square";

export const createPaymentLink = async (req: Request, res: Response) => {
  const client = new Client({
    environment: Environment.Sandbox,
    accessToken: process.env.SQUARE_SANDBOX_TOKEN,
  });

  try {
    const { totalAmount, names } = req.body;
    const paymentLink = await client.checkoutApi.createPaymentLink({
      idempotencyKey: nanoid(),
      quickPay: {
        name: names,
        priceMoney: {
          amount: parseInt(totalAmount + "00") as any,
          currency: "GBP",
        },
        locationId: "LKP57Q2WHYP9D",
      },
      source: "abacus",
      paymentNote: "Order has been received",
    });

    // console.log(paymentLink.result.paymentLink);

    res.send(paymentLink.result);
  } catch (error) {
    log.error(error);
  }
};
