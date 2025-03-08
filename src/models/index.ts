import { Sequelize } from 'sequelize';
import config from '../config/config';

export const sequelize = new Sequelize({
  dialect: config.database.dialect as any,
  storage: config.database.storage,
  logging: false,
});

import UserModel from './user';
import PostModel from './post';

export const User = UserModel(sequelize);
export const Post = PostModel(sequelize);

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
