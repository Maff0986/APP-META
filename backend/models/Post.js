const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mediaUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft',
    allowNull: false
  },
  targetAccount: {
    type: DataTypes.STRING,
    defaultValue: 'instagram',
    allowNull: false
  },
  metaPostId: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Post;
