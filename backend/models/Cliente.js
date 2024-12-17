const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: String,
  historialCortes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corte'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cliente', clienteSchema); 