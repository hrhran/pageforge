import cron from 'node-cron';
import { Op } from 'sequelize';
import { Post } from '../models';
import { generateHomepage, generatePostPage } from '../ssg/ssg';

cron.schedule('* * * * *', async () => {
  console.log('Scheduler: checking for posts to publish...');
  try {
    const now = new Date();
    const posts = await Post.findAll({
      where: {
        published: false,
        scheduledAt: {
          [Op.lte]: now
        }
      }
    });
    
    for (const post of posts) {
      post.published = true;
      await post.save();
      await generateHomepage();
      await generatePostPage(post.id);
      console.log(`Published scheduled post ${post.id}`);
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
});
