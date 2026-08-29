const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const useSSL = process.env.DB_SSL === 'true' || isProduction;

const sslOptions = useSSL ? {
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  }
} : {};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: isProduction ? false : console.log,
    dialectOptions: sslOptions,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'spinfyot',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      logging: isProduction ? false : console.log,
      dialectOptions: sslOptions,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;
