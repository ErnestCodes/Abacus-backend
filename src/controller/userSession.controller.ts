import { CookieOptions, Request, Response } from "express";
import { createSession } from "../service/session.service";
import {
  findAndUpdateUser,
  getGoogleOauthTokens,
  getGoogleUser,
} from "../service/user.service";
import config from "config";
import { signJwt } from "../utils/jwt.utils";
import log from "../utils/logger";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15m
  httpOnly: false,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1yr
};

// Oauth handler
export async function googleOauthHandler(req: Request, res: Response) {
  // get the code from the query-string
  const code = req.query.code as string;

  try {
    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOauthTokens({ code });

    // console.log({ id_token, access_token });
    // get the user with token
    const googleUser = await getGoogleUser({ id_token, access_token });
    // jwt.decode(id_token)

    if (!googleUser.verified_email) {
      return res.status(403).send("Google Account is not verfied");
    }

    // console.log({ googleUser });
    // upsert the user
    const user = await findAndUpdateUser(
      { email: googleUser.email },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      { upsert: true, new: true }
    );

    if (!user) {
      return;
    }

    // create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // console.log({ session });

    // create an access token
    const accessToken = signJwt(
      {
        ...(user.toJSON() as any),
        session: session._id as any,
      },
      {
        expiresIn: config.get("accessTokenTtl"), // 15 minutes
      }
    );

    //   create a refresh token
    const refreshToken = signJwt(
      {
        ...(user.toJSON() as any),
        session: session._id as any,
      },
      {
        expiresIn: config.get("refreshTokenTtl"), // 15 minutes
      }
    );

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // redirect back to client
    res.redirect("http://localhost:3000");
  } catch (error: any) {
    log.error(error, "Failed to authorize Google user");
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
}
