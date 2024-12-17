const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permiso para realizar esta acción' 
      });
    }
    next();
  };
};

module.exports = checkRole; 