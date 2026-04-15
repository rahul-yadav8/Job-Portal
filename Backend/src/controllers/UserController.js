import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { blacklistedTokens } from "../utils/blacklistedTokens.js";
import { User } from "../models/userModel.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const register = async (req, res) => {
  try {
    const { fullname, email, phone, password, role, avatar } = req.body;

    if (!fullname || !email || !password || !role || !phone) {
      return res.status(404).json({ message: "Missing required field" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already register" });
    }

    // user with phone number already exits
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phone,
      role: role,
      avatar: avatar,
    });

    res.status(201).json({
      message: `${fullname} register successfully`,
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!password || !email) {
      return res.status(404).json({ message: "Missing required field" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user with this email does not exit" });
    }

    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // if (user.role !== role) {
    //   return res.status(403).json({ message: "You don't have the necessary role to access this resource" });
    // }

    res.status(200).json({
      message: "Login successful",
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    blacklistedTokens.add(token);

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadFromBuffer = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer(req.file.buffer);
    res.status(200).json({
      message: "Avatar uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const { fullname, avatar, email, phone, bio, skills } = req.body;

  let skillsArray;
  if (skills) {
    skillsArray = skills.split(",");
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (fullname) {
    user.fullname = fullname;
  }
  if (avatar) {
    user.avatar = avatar;
  }
  if (email) {
    user.email = email;
  }
  if (phone) {
    user.phone = phone;
  }
  if (bio) {
    user.bio = bio;
  }
  if (skills) {
    user.skills = skillsArray;
  }

  await user.save();

  res.status(200).json({
    message: "Profile Updated successfully",
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    profile: user.profile,
  });

  try {
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const deleteResume = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.role !== "jobseeker") {
//       return res.status(403).json({ message: "Only jobseeker can delete resume" });
//     }

//     user.resume = "";

//     await user.save();

//     res.status(200).json({ message: "Resume deleted successfully" });
//   } catch (error) {
//     console.log("ERROR:", error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };
