import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Post } from '../models';
import { generateHomepage, generatePostPage, generateStaticSite } from '../ssg/ssg';
import { AuthRequest } from '../middleware/authMiddleware';

const OUTPUT_DIR = path.join(__dirname, '../../build/blog');

const deleteRenderFile = (postId: number) => {
  const filename = `post-${postId}.html`;
  const filepath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    console.log(`Deleted render file: ${filepath}`);
  }
};

const runSSGBuild = async (postId?: number) => {
  if (postId) {
    await generateHomepage();
    await generatePostPage(postId);
  } else {
    await generateStaticSite();
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content, scheduledAt, renderFile } = req.body;
  const userId = req.user.id;
  
  try {
    let publishNow = true;
    let scheduledDate = null;
    if (scheduledAt) {
      scheduledDate = new Date(scheduledAt);
      if (scheduledDate > new Date()) {
        publishNow = false;
      }
    }
    
    const post = await Post.create({
      title,
      content,
      userId,
      published: publishNow,
      scheduledAt: scheduledDate,
      renderFile: renderFile || null,
    });
    
    if (publishNow) {
      await runSSGBuild(post.id);
    }
    
    res.json({ message: 'Post created successfully', post });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
    return;
  }
};

export const listPosts = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    let posts;
    if (user.role === 'superadmin') {
      posts = await Post.findAll();
    } else {
      posts = await Post.findAll({ where: { userId: user.id } });
    }
    res.json(posts);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error });
    return;
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, scheduledAt, renderFile } = req.body;
  const user = req.user;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    
    if (user.role !== 'superadmin' && post.userId !== user.id) {
      res.status(403).json({ message: 'Not authorized to update this post' });
      return;
    }
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.scheduledAt = scheduledAt ? new Date(scheduledAt) : post.scheduledAt;
    post.renderFile = renderFile || post.renderFile;
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      post.published = false;
    }
    
    await post.save();
    await runSSGBuild(post.id);
    res.json({ message: 'Post updated successfully', post });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
    return;
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    
    if (user.role !== 'superadmin' && post.userId !== user.id) {
      res.status(403).json({ message: 'Not authorized to delete this post' });
      return;
    }
    
    deleteRenderFile(post.id);
    
    await post.destroy();
    await runSSGBuild();
    res.json({ message: 'Post deleted successfully' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
    return;
  }
};
