import { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";

// Authors ranked by number of posts
export const getAuthorsRanking = async (_req: Request, res: Response) => {
  try {
    const authors = await Post.aggregate([
      { $group: { _id: "$author", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
    ]);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors ranking", error });
  }
};

// Top 5 most commented posts
export const getTopPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Comment.aggregate([
      { $group: { _id: "$postId", commentCount: { $sum: 1 } } },
      { $sort: { commentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching top posts", error });
  }
};

// Posts created per day (last 7 days)
export const getPostsPerDay = async (_req: Request, res: Response) => {
  try {
    const last7days = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(last7days);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts per day", error });
  }
};
