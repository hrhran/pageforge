import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  database: {
    storage: process.env.DATABASE_STORAGE || './database.sqlite',
    dialect: 'sqlite'
  }
};
