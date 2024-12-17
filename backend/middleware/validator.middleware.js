const { validationResult, body } = require('express-validator');

// Middleware para verificar errores de validación
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones para autenticación
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validateRequest
];

const registerValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['peluquero', 'admin']).withMessage('Rol inválido'),
  validateRequest
];

// Validaciones para clientes
const clienteValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('telefono').notEmpty().withMessage('El teléfono es requerido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  validateRequest
];

// Validaciones para cortes
const corteValidation = [
  body('clienteId').isMongoId().withMessage('ID de cliente inválido'),
  body('tipoCorte').notEmpty().withMessage('El tipo de corte es requerido'),
  body('precio').isNumeric().withMessage('El precio debe ser un número'),
  validateRequest
];

const olvidoPasswordValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  validateRequest
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token es requerido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validateRequest
];

module.exports = {
  loginValidation,
  registerValidation,
  clienteValidation,
  corteValidation,
  olvidoPasswordValidation,
  resetPasswordValidation
}; 