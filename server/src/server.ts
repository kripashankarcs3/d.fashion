import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

startServer();