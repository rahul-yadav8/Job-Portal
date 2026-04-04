import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employer", "jobseeker"],
    },
    avatar: String,
    resume: String,
    companyName: String,
    companyDescription: String,
    companyLogo: String,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", schema);
