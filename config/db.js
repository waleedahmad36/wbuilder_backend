
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = globalThis.mongoose;

if (!cached) {
    cached = globalThis.mongoose = {
        conn: null,
        promise: null,
    };
}

export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in environment variables");
    }

    if (mongoose.connection.readyState === 0) {
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
        }).then((mongooseInstance) => mongooseInstance)
          .catch((error) => {
              cached.promise = null;
              throw error;
          });
    }

    cached.conn = await cached.promise;

    console.log("MongoDB connected:", mongoose.connection.host);

    return cached.conn;
};
