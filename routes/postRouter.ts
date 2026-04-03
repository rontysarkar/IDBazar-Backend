import express from 'express'
import * as postController from '../controllers/postController'
import { multerMiddleware } from '../config/cloudinaryConfig';
import { authenticatedUser } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/',authenticatedUser,multerMiddleware,postController.createPost);
router.get('/',authenticatedUser,postController.getAllPosts);
router.get('/:slug',authenticatedUser,postController.getPostById);

export default router;