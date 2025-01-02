import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
	dotenv.config();
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected: " + conn.connection.host);
	} catch (error) {
		console.error("Error connecting to MONGODB: " + error.message);
		process.exit(1); 
	}
};