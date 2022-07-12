import { object, string, TypeOf } from "zod";
import { OmitBy, Split } from "../utils/OmitHelper";

export const createAdminUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "Password confirm is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateAdminUserInput = OmitBy<
  TypeOf<typeof createAdminUserSchema>,
  Split<"body.passwordConfirmation">
>;
