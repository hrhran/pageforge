import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  scheduledAt?: Date | null;
  published: boolean;
  userId: number;
  renderFile?: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'scheduledAt' | 'published' | 'renderFile'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public scheduledAt?: Date | null;
  public published!: boolean;
  public userId!: number;
  public renderFile?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      renderFile: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: 'posts',
      sequelize,
    }
  );

  return Post;
};
