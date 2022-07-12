import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface AdminInput {
  email: string;
  password: string;
}

export interface AdminDocument extends AdminInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  let adminUser = this as unknown as AdminDocument;
  if (!adminUser.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = bcrypt.hashSync(adminUser.password, salt);

  adminUser.password = hash;

  return next();
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const adminUser = this as AdminDocument;

  return bcrypt
    .compare(candidatePassword, adminUser.password)
    .catch((e) => false);
};

const AdminModel = mongoose.model<AdminDocument>("Admin", adminSchema);

export default AdminModel;
