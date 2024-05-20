const dotenv = require('dotenv');
dotenv.config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB,
    process.env.USERNAME,
    process.env.PASSWORD,
    {
        dialect: 'mysql',
        logging: false, // Disable logging of Sequelize queries
        host: process.env.HOST,
    }
);

module.exports = sequelize;