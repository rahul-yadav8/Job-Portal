import { Company } from "../models/companyModal.js";

// register a new company
export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, location, website, logo } = req.body;

    if (!companyName || !description || !location || !website) {
      return res.status(404).json({ message: "Missing required field" });
    }

    const findCompany = await Company.findOne({ companyName });

    if (findCompany) {
      res.status(400).json({ message: "company already exits" });
    }

    let company = {
      companyName,
      description,
      location,
      website,
      logo,
      userId: [req.user._id],
    };

    company = await Company.create(company);
    res.status(201).json({ message: "company created successfully", company });
  } catch (error) {
    console.log("ERROR:", error.message);
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// get the list of all companies
export const getALlCompany = async (req, res) => {
  const userId = req.user._id;

  try {
    const company = await Company.find({ userId: userId });
    res.status(200).json({ company });
  } catch (error) {
    console.log("ERROR:", error.message);
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// update company details
export const updateCompany = async (req, res) => {
  try {
    const { companyName, location, description, website, logo } = req.body;
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (!company.userId.includes(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (companyName) {
      company.companyName = companyName;
    }
    if (location) {
      company.location = location;
    }
    if (description) {
      company.description = description;
    }
    if (website) {
      company.website = website;
    }
    if (logo) {
      company.logo = logo;
    }

    await company.save();

    res.status(200).json({
      message: "Company Updated successfully",
      _id: company._id,
      companyName: company.companyName,
      description: company.description,
      location: company.location,
      website: company.website,
      logo: company.logo,
    });
  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// delete company
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (!company.userId.includes(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await company.deleteOne();

    res.status(200).json({ message: "Company Deleted Successfully" });
  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
