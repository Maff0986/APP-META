import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.STRING, allowNull: false },
  igAccountId: { type: DataTypes.STRING },
  type:        { type: DataTypes.ENUM('image','reel','story'), defaultValue: 'image' },
  mediaUrl:    { type: DataTypes.TEXT },
  caption:     { type: DataTypes.TEXT },
  scheduledAt: { type: DataTypes.DATE },
  publishedAt: { type: DataTypes.DATE },
  postId:      { type: DataTypes.STRING },
  status:      { type: DataTypes.ENUM('pending','published','error'), defaultValue: 'pending' },
  error:       { type: DataTypes.TEXT }
}, { tableName: 'posts', timestamps: true });

export default Post;
