import mongoose from "mongoose";
import { logger } from "../src/middlewares/logger.middleware.js";

const dburl = process.env.MONGODB_URL || "0.0.0.0:27017";

export const connectToDB = async () => {
  try {
    await mongoose.connect(`mongodb://${dburl}/postaway`);
    logger.info(
      `${new Date().toString()} - Connected to database successfully`
    );
    console.log("Connected to database successfully");
  } catch (err) {
    logger.error(`${new Date().toString()} - ` + err.toString());
    console.log(err);
  }
};
