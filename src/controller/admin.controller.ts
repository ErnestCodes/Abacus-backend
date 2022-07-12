import { Request, Response } from "express";
import { CreateAdminUserInput } from "../schema/admin.schema";
import { omit } from "lodash";
import { createAdminUser } from "../service/admin.service";
import log from "../utils/logger";

export async function createAdminUserHandler(
  req: Request<{}, {}, CreateAdminUserInput["body"]>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createAdminUser(body);

    return res.send(user);
  } catch (error: any) {
    // 409 means conflict
    log.error(error);
    return res.status(409).send(error.message);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}
