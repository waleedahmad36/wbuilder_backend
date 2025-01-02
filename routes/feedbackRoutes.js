import express from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

// Route to create feedback
router.post('/', createFeedback);

// Route to get all feedback
router.get('/', getAllFeedback);

export default router;
