import { Request, Response } from 'express';
import { BlogSettings } from '../models';

export const getBlogSettings = async (req: Request, res: Response) => {
  try {
    let settings = await BlogSettings.findOne();
    if (!settings) {
      settings = await BlogSettings.create({
        blogTitle: "My Blog",
        seoDescription: "",
        seoKeywords: "",
        navbarLinks: "[]"
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog settings', error });
  }
};

export const updateBlogSettings = async (req: Request, res: Response) => {
  const { blogTitle, seoDescription, seoKeywords, navbarLinks } = req.body;
  try {
    let settings = await BlogSettings.findOne();
    if (!settings) {
      settings = await BlogSettings.create({
        blogTitle: blogTitle || "My Blog",
        seoDescription: seoDescription || "",
        seoKeywords: seoKeywords || "",
        navbarLinks: navbarLinks ? JSON.stringify(navbarLinks) : "[]"
      });
    } else {
      settings.blogTitle = blogTitle || settings.blogTitle;
      settings.seoDescription = seoDescription || settings.seoDescription;
      settings.seoKeywords = seoKeywords || settings.seoKeywords;
      settings.navbarLinks = navbarLinks ? JSON.stringify(navbarLinks) : settings.navbarLinks;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog settings', error });
  }
};
