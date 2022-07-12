import { CookieOptions, Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import jwt from "jsonwebtoken";
import { validateAdminPassword } from "../service/admin.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import log from "../utils/logger";
import AdminModel from "../models/admin.models";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15m
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1yr
};

export async function createAdminUserSessionHandler(
  req: Request,
  res: Response
) {
  // Validate d users password
  const user = await validateAdminPassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  const adminData = await AdminModel.findById(user._id);

  if (!adminData) {
    res.status(400);
    throw new Error("User not found");
  }
  // create an access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get("accessTokenTtl"), // 15 minutes
    }
  );

  //   create a refresh token
  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get("refreshTokenTtl"), // 15 minutes
    }
  );

  // set cookies
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  // return access and refresh token
  return res.status(200).send({ accessToken, refreshToken, adminData });
}

export async function getAdminUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteAdminSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ query: { _id: sessionId }, update: { valid: false } });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
