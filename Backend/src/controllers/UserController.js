import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body;

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  if (resume) user.resume = resume;

  if (user.role == "employer") {
    if (companyName) user.companyName = companyName;
    if (companyDescription) user.companyDescription = companyDescription;
    if (companyLogo) user.companyLogo = companyLogo;
  }

  await user.save();

  res.status(200).json({ message: "Profile Updated successfully", user });

  try {
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only jobseeker can delete resume" });
    }

    user.resume = "";

    await user.save();

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
