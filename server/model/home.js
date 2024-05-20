const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const HomeDetails = sequelize.define("instruction_details", {
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
});

module.exports = HomeDetails
