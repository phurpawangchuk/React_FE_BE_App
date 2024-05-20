
const DataTypes = require('sequelize');

const sequelize = require('../util/database');

const UserRegistration = sequelize.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalLogin: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
        // Other model options

    });

// One-To-One association
// CardRegistration.belongsTo(CardType);
// CardRegistration.belongsTo(RegCardType);

module.exports = UserRegistration;
