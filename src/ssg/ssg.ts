import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { Post, BlogSettings, User } from '../models';

const OUTPUT_DIR = path.join(__dirname, '../../build/blog');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

export const generateHomepage = async () => {
  const posts = await Post.findAll({ 
    where: { published: true },
    include: [{
      model: User,
      as: 'author',
      attributes: ['displayName']
    }],
    order: [['createdAt', 'DESC']]
  });

  let settings = await BlogSettings.findOne();
  if (!settings) {
    settings = await BlogSettings.create({
      blogTitle: "My Blog",
      seoDescription: "",
      seoKeywords: "",
      navbarLinks: "[]"
    });
  }
  
  const templatePath = path.join(__dirname, 'templates', 'index.ejs');
  const template = fs.readFileSync(templatePath, 'utf8');
  const html = ejs.render(template, { settings, posts });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log('Homepage generated.');
};

export const generatePostPage = async (postId: number) => {
  const post = await Post.findByPk(postId, {
    include: [{
      model: User,
      as: 'author',
      attributes: ['displayName']
    }]
  });
  if (!post) {
    console.error(`Post ${postId} not found for SSG.`);
    return;
  }
  
  let settings = await BlogSettings.findOne();
  if (!settings) {
    settings = await BlogSettings.create({
      blogTitle: "My Blog",
      seoDescription: "",
      seoKeywords: "",
      navbarLinks: "[]"
    });
  }
  
  const templatePath = path.join(__dirname, 'templates', 'post.ejs');
  const template = fs.readFileSync(templatePath, 'utf8');
  const html = ejs.render(template, { settings, post });
  
  const filename = `post-${post.id}.html`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
  console.log(`Post page for post ${post.id} generated.`);
};

export const generateStaticSite = async () => {
  await generateHomepage();
  const posts = await Post.findAll({ where: { published: true } });
  for (const post of posts) {
    await generatePostPage(post.id);
  }
};
