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
    const items = req.body;
    const paymentLink = await client.checkoutApi.createPaymentLink({
      idempotencyKey: nanoid(),
      order: {
        locationId: "LKP57Q2WHYP9D",
        customerId: nanoid(),
        lineItems: [
          items.map((item: any) => ({
            uid: nanoid(),
            name: item.title,
            quantity: "1",
            itemType: "ITEM",
            basePriceMoney: {
              amount: parseInt(item.price),
              currency: "GBP",
            },
            appliedTaxes: [
              {
                uid: nanoid(9),
                taxUid: nanoid(6),
              },
            ],
            appliedDiscounts: [
              {
                uid: nanoid(),
                discountUid: nanoid(),
              },
            ],
          })),
        ],
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
