import { Portfolio } from "../models/portfolioModel.js";
import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file handling
const storage = multer.diskStorage({});
export const upload = multer({ storage });

// Utility function to upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file.path, {
            folder,
        });
        return result.secure_url;
    } catch (error) {
        throw new Error("Failed to upload to Cloudinary: " + error.message);
    }
};

const deleteFromCloudinary = async (fileUrl) => {
    const publicId = fileUrl.split('/').pop().split('.')[0]; 
    await cloudinary.v2.uploader.destroy(publicId);
};

// Create a new portfolio
export const createPortfolio = async (req, res) => {
    try {
        const {logo , sublogo , userId, name, title, description, projects, skills, address, phone, email, fbLink, githubLink, linkedinLink, twitterLink, template  } = req.body;

        if(!logo || !sublogo || !name || !title || !description || !projects || !skills || !address || !phone ||!email || !fbLink || !githubLink || !linkedinLink || !twitterLink || !template) {
            return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
        }

      
        const existingPortfolio = await Portfolio.findOne({ userId });
        if (existingPortfolio) {
            return res
                .status(400)
                .json({ success: false, message: "Please delete the existing one to create a new one." });
        }
        
        // Handle image and CV upload
        const imageUrl = req.files?.image ? await uploadToCloudinary(req.files.image[0], "images") : "";
        const cvUrl = req.files?.cv ? await uploadToCloudinary(req.files.cv[0], "cvs") : "";

        const portfolio = new Portfolio({
            userId,
            logo,
            sublogo,
            name,
            title,
            description,
            projects:JSON.parse(projects),
            skills: JSON.parse(skills),
            address,
            phone,
            email,
            fbLink,
            githubLink,
            linkedinLink,
            twitterLink,
            template,
            cv: cvUrl,
            image: imageUrl,
        });

        await portfolio.save();
        res.status(201).json({ success: true, data: portfolio });
    } catch (error) {
        console.log("Error in createPortfolio controller", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get portfolio by ID
export const getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolio = await Portfolio.findById(id).populate({
            path: "userId", 
            select: "-password", 
          });;
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }
        res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all portfolios
export const getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find()
  .populate({
    path: "userId", 
    select: "-password", 
  });
        res.status(200).json({ success: true, data: portfolios });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Edit portfolio
export const editPortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { projects, skills, ...updateFields } = req.body;

        console.log("Received projects:", projects);
        console.log("Received skills:", skills);

        // Find the existing portfolio
        const existingPortfolio = await Portfolio.findById(id);
        if (!existingPortfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }

        // Handle image upload
        if (req.files?.image) {
            if (existingPortfolio.image) {
                await deleteFromCloudinary(existingPortfolio.image);
            }
            updateFields.image = await uploadToCloudinary(req.files.image[0], "images");
        }

        // Handle CV upload
        if (req.files?.cv) {
            if (existingPortfolio.cv) {
                await deleteFromCloudinary(existingPortfolio.cv);
            }
            updateFields.cv = await uploadToCloudinary(req.files.cv[0], "cvs");
        }

        try {
            updateFields.projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
            if (Array.isArray(updateFields.projects)) {
                updateFields.projects = updateFields.projects.map(project => 
                    typeof project === 'string' ? JSON.parse(project) : project);
            }
            console.log("Parsed projects:", updateFields.projects);
        } catch (error) {
            console.log("Invalid JSON format for projects:", error.message);
            return res.status(400).json({ success: false, message: "Invalid JSON format for projects" });
        }

        try {
            updateFields.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
            if (Array.isArray(updateFields.skills)) {
                updateFields.skills = updateFields.skills.map(skill => 
                    typeof skill === 'string' ? JSON.parse(skill) : skill);
            }
            console.log("Parsed skills:", updateFields.skills);
        } catch (error) {
            console.log("Invalid JSON format for skills:", error.message);
            return res.status(400).json({ success: false, message: "Invalid JSON format for skills" });
        }

        // Update the portfolio
        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            id,
            { ...updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedPortfolio });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};




export const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }

        
        if (portfolio.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this portfolio" });
        }

        // Delete images from Cloudinary
        if (portfolio.image) {
            await deleteFromCloudinary(portfolio.image);
            console.log('inside delete image')
        }
        if (portfolio.cv) {
            await deleteFromCloudinary(portfolio.cv);
        }

        // Delete the portfolio
        await Portfolio.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Portfolio deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPortfolioByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        
        const portfolio = await Portfolio.findOne({ userId: user._id }) .populate({
            path: "userId", 
            select: "-password", 
          });
        
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found for this user" });
        }

        res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};