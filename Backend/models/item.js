// backend/models/item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // importa tu conexión a la BD

// Definición del modelo
const Hi = sequelize.define('Hi', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'hi', // nombre exacto de la tabla en la BD
  timestamps: false
});

module.exports = Hi;
