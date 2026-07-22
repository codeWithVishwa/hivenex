import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = ["super_admin", "admin", "moderator"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "moderator" },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Never leak the hash
userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    username: this.username,
    role: this.role,
    createdAt: this.createdAt,
  };
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 12);
};

export default mongoose.model("User", userSchema);
