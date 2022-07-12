import { omit } from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
require("dotenv").config();
import { SessionDocument } from "../models/session.model";
import AdminModel, { AdminDocument, AdminInput } from "../models/admin.models";

export async function createAdminUser(input: AdminInput) {
  try {
    const adminUser = await AdminModel.create(input);

    return omit(adminUser.toJSON(), "password");
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function validateAdminPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const adminUser = await AdminModel.findOne({ email });

  if (!adminUser) {
    return false;
  }

  const isValid = await adminUser.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(adminUser.toJSON(), "password");
}

export async function findAdminUser(query: FilterQuery<AdminDocument>) {
  return AdminModel.findOne(query).lean();
}

// console.log(process.env);
