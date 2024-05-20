const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const CardType = sequelize.define("card_type", {
    cardType: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = CardType
