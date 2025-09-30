import express from "express";
import { getAuthorsRanking, getTopPosts, getPostsPerDay } from "../controller/analyticsController";

const router = express.Router();

router.get("/authors", getAuthorsRanking);
router.get("/top-posts", getTopPosts);
router.get("/posts-per-day", getPostsPerDay);

export default router;
