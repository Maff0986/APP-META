const { Sequelize } = require('sequelize');
const path = require('path');

const databasePath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'app.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: false,
});

module.exports = sequelize;
