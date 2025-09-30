import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import postRoutes from "./routes/postRoutes";     
import analyticsRoutes from "./routes/analyticsRoutes"; 
import authRoutes from "./routes/authRoutes";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


app.get("/", (_req, res) => {
  res.send("API is running...");
});


app.use("/api/posts", postRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
