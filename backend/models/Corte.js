const mongoose = require('mongoose');

const corteSchema = new mongoose.Schema({
  peluquero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  tipoCorte: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Corte', corteSchema); 