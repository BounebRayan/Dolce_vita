import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ADMIN_SECRET_KEY as string;

export async function verifyToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Authorization token missing or invalid' };
    }
  
    const token = authHeader.split(' ')[1];
    try {
      if (!SECRET_KEY) {
        return { valid: false, error: 'Secret key is not defined' };
      }
      const decoded = jwt.verify(token, SECRET_KEY);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: 'Invalid or expired token' };
    }
  }
  