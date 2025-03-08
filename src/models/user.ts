import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  displayName: string;
  role: 'superadmin' | 'user';
  aiEnabled: boolean;
  aiModel?: string;
  aiApiKey?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'displayName' | 'role' | 'aiEnabled' | 'aiModel' | 'aiApiKey'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public displayName!: string;
  public role!: 'superadmin' | 'user';
  public aiEnabled!: boolean;
  public aiModel?: string;
  public aiApiKey?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      role: {
        type: DataTypes.ENUM('superadmin', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      aiEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      aiModel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aiApiKey: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: 'users',
      sequelize,
    }
  );

  return User;
};
