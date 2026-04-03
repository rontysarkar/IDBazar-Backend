import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Post from "../models/Post";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, category, price, description, status } = req.body;
    const images = req.files as Express.Multer.File[];
    const sellerId = req.id;
    if (!images || images.length === 0) {
      return response(res, 400, "Image is Required");
    }

    const uploadPromise = images.map((file) => uploadToCloudinary(file as any));
    const uploadImage = await Promise.all(uploadPromise);
    const imageUrl = uploadImage.map((img) => img.secure_url);

    const post = new Post({
      title,
      category,
      price,
      description,
      status,
      seller: sellerId,
      images: imageUrl,
    });
    await post.save();

    return response(res, 200, "Post Create Successfully", post);
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("seller", "name email");
    return response(res, 200, "Get all data successfully", posts);
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const id = slug.split("-").pop();
    const post = await Post.findById(id).populate({
      path: "seller",
      select: "name email profilePicture phoneNumber",
    });
    return response(res, 200, "Get Post Successfully",post);
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};
