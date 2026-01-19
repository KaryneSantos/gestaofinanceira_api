const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Renda = sequelize.define('Renda', {
    id_renda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id_user'
        },
        onDelete: 'CASCADE'
    },
},{
    tableName: 'renda',
    timestamps: true
});

Renda.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
User.hasMany(Renda, { foreignKey: 'usuario_id', as: 'renda' });

module.exports = Renda;