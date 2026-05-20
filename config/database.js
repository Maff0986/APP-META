import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, '../database/shopinista.db'),
  logging: false,
});

export default sequelize;
