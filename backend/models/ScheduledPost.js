const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./Post');

const ScheduledPost = sequelize.define('ScheduledPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Post,
      key: 'id'
    }
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recurrence: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'scheduled_posts'
});

// Define associations
ScheduledPost.associate = (models) => {
  ScheduledPost.belongsTo(models.Post, { foreignKey: 'postId' });
};

module.exports = ScheduledPost;
