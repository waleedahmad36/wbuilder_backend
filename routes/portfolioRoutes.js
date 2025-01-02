import express from "express";
import {
    createPortfolio,
    getPortfolioById,
    getAllPortfolios,
    editPortfolio,
    deletePortfolio,
    getPortfolioByUsername,
    upload,
} from "../controllers/portfolioControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Create a new portfolio
router.post(
    "/create",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "cv", maxCount: 1 },
    ]),protectRoute,
    createPortfolio
);

// Get portfolio by ID
router.get("/:id",protectRoute ,  getPortfolioById);
router.get("/user/:username", getPortfolioByUsername);

// Get all portfolios
router.get("/", getAllPortfolios);

// Edit a portfolio
router.put(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "cv", maxCount: 1 },
    ]),protectRoute,
    editPortfolio
);

// Delete a portfolio
router.delete("/:id",protectRoute, deletePortfolio);

export default router;