import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId; 
  commenter: string;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, 
    commenter: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);
