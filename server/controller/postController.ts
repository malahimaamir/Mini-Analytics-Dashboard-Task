import { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";

// Create Post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, author } = req.body;
    const post = await Post.create({ title, content, author });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Add Comment
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { commenter, text, parentId } = req.body;

    const comment = await Comment.create({
      postId: id,
      parentId: parentId || null,
      commenter,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};


// Get all posts with comment count
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { author } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (author) {
      match.author = { $regex: new RegExp(author as string, "i") }; 
    }

    const total = await Post.countDocuments(match); 

    const posts = await Post.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      { $addFields: { commentCount: { $size: "$comments" } } },
      { $project: { comments: 0 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({ total, page, limit, posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get all comments for a specific post
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};
