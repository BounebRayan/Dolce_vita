// utils/auth.ts
import jwt from 'jsonwebtoken';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_password');
  if (!token) return false;

  try {
    const decoded = jwt.decode(token) as { exp: number };
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('admin_password'); // Remove expired token
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
