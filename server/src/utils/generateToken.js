import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};
