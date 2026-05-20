import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.STRING, allowNull: false },
  sku:         { type: DataTypes.STRING },
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price:       { type: DataTypes.FLOAT },
  imageUrl:    { type: DataTypes.TEXT },
  url:         { type: DataTypes.TEXT },
  metaId:      { type: DataTypes.STRING },
  catalogId:   { type: DataTypes.STRING },
  synced:      { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'products', timestamps: true });

export default Product;
