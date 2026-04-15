import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
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
    profile: {
      bio: {
        type: String,
      },
      skills: [
        {
          type: String,
        },
      ],
      resume: {
        type: String,
      },
      resumeOriginalname: {
        type: String,
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
      },
    },
    avatar: String,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", schema);
