import express from "express";
import {
  createPost,
  addComment,
  getPosts,
  getCommentsByPost,
  getPostById,
} from "../controller/postController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, createPost);

router.get("/:id", getPostById);

router.post("/:id/comments", addComment);
router.get("/:id/comments", getCommentsByPost);
router.get("/", getPosts);

export default router;
