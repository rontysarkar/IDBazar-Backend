import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug?: string;
  images: string[];
  category: {
    name: string;
    slug?: string;
  };
  price: number;
  description?: string;
  status?: string;
  seller: mongoose.Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String },
    images: [{ type: String }],
    category: {
      name: { type: String, required: true },
      slug: { type: String },
    },
    price: { type: Number, required: true },
    description: { type: String },
    status: { type: String,default:"Pending"},
    seller: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model<IPost>('Post',postSchema)