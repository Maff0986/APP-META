import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MetaToken = sequelize.define('MetaToken', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.STRING,  allowNull: false },
  metaUserId:  { type: DataTypes.STRING },
  metaName:    { type: DataTypes.STRING },
  accessToken: { type: DataTypes.TEXT,    allowNull: false },
  expiresAt:   { type: DataTypes.DATE },
}, {
  tableName:  'meta_tokens',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId'] }],
});

export default MetaToken;
