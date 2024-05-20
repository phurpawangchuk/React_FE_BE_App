
const DataTypes = require('sequelize');
const CardType = require('../model/cardtype');
const RegCardType = require('../model/regtype');

const sequelize = require('../util/database');

const CardRegistration = sequelize.define('registrations', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registration_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cardTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: true
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cardnumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    author: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
        // Other model options

    });

// One-To-One association
CardRegistration.belongsTo(CardType);
CardRegistration.belongsTo(RegCardType);

module.exports = CardRegistration;
