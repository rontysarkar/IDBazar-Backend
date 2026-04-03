import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Post from "../models/Post";
import { generateCategorySlug, generateTitleSlug } from "../utils/generateSlug";

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

    const newPost = new Post({
      title,
      category,
      price,
      description,
      status,
      seller: sellerId,
      images: imageUrl,
    });

    const savePost = await newPost.save();
    const titleSlug = generateTitleSlug(
      savePost.title,
      savePost._id.toString(),
    );
    const categorySlug = generateCategorySlug(savePost.category.name);
    savePost.slug = titleSlug;
    savePost.category.slug = categorySlug;
    await savePost.save();
    return response(res, 200, "Post Create Successfully", savePost);
  } catch (error) {
    console.log(error);
    response(res, 500, "Intarnal Server Error,Please try again");
  }
};
