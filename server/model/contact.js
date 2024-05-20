const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const Contact = sequelize.define("contact", {
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Contact
