import { object, string, TypeOf } from "zod";
import { OmitBy, Split } from "../utils/OmitHelper";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
    pictures: string().optional(),
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

export type CreateUserInput = OmitBy<
  TypeOf<typeof createUserSchema>,
  Split<"body.passwordConfirmation">
>;
