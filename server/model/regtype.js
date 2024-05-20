const DataTypes = require('sequelize');
const sequelize = require('../util/database');

const RegCardType = sequelize.define("reg_types", {
    regType: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = RegCardType;
