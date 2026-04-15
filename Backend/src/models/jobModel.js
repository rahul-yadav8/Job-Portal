import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: {
      type: String,
    },
    description: { type: string, required: true },
    requirement: { type: string, required: true },
    category: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"],
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    isClosed: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Jobs = mongoose.model("Jobs", jobSchema);
