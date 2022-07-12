import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { findAdminUser } from "./admin.service";
import config from "config";

export async function createSession(userId: string, userAgent: string) {
  // Here we create a session with userId and userAgent
  const session = await SessionModel.create({
    user: userId,
    userAgent,
  });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  // find session & assume every query to this model
  // requires .lean()
  return SessionModel.find(query).lean();
}

export async function updateSession({
  query,
  update,
}: {
  query: FilterQuery<SessionDocument>;
  update: UpdateQuery<SessionDocument>;
}) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  // find the user
  const user = await findAdminUser({ _id: session.user });

  if (!user) return false;

  // create a new access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get("accessTokenTtl"), // 15 minutes
    }
  );

  return accessToken;
}
