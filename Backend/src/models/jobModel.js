import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: string, required: true },
    requirement: { type: string, required: true },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"],
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    category: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: null,
    },
  },
  { timestamps: true },
);

export const Jobs = mongoose.model("Jobs", jobSchema);
