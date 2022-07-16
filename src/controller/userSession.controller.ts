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
  maxAge: 1000 * 60 * 60 * 24 * 365 * 7, // 7 days
  httpOnly: true,
  domain: "http://localhost:3000",
  path: "/",
  sameSite: "lax",
  // secure: true,
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

    // log.info({ id_token, access_token });
    // get the user with token
    const googleUser = await getGoogleUser({ id_token, access_token });
    // jwt.decode(id_token)

    if (!googleUser.verified_email) {
      return res.status(403).send("Google Account is not verfied");
    }

    // log.info({ googleUser });
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

    // // set cookies
    // res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    // res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    const details = {
      access: encodeURIComponent(accessToken),
      refresh: encodeURIComponent(refreshToken),
    };

    // redirect back to client
    res.redirect("http://localhost:3000?data=" + details);

    return { accessToken, refreshToken };
  } catch (error: any) {
    log.error(error, "Failed to authorize Google user");
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
}
