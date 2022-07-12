import { object, string, TypeOf } from "zod";
import { OmitBy } from "../utils/OmitHelper";

export const createUserSessionSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password should be 6 chars minimum"),
  }),
});
