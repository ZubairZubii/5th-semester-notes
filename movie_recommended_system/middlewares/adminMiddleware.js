
module.exports = (req, res, next) => {
  console.log('User Role:', req.user.role); // Debugging log
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  