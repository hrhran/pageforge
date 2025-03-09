import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface BlogSettingsAttributes {
  id: number;
  blogTitle: string;
  seoDescription: string;
  seoKeywords: string;
  navbarLinks: string; // JSON string representing an array of { text: string, url: string }
}

interface BlogSettingsCreationAttributes extends Optional<BlogSettingsAttributes, 'id'> {}

class BlogSettings extends Model<BlogSettingsAttributes, BlogSettingsCreationAttributes> implements BlogSettingsAttributes {
  public id!: number;
  public blogTitle!: string;
  public seoDescription!: string;
  public seoKeywords!: string;
  public navbarLinks!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  BlogSettings.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      blogTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seoDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      seoKeywords: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      navbarLinks: {
        type: DataTypes.TEXT, // stored as JSON string
        allowNull: true,
        defaultValue: '[]'
      },
    },
    {
      tableName: 'blog_settings',
      sequelize,
    }
  );

  return BlogSettings;
};
