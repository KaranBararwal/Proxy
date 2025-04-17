import jwt from 'jsonwebtoken';

export function verifyJwt(token) {
  try {
    if (!token) throw new Error('No token provided');
    console.log('Token:', token); // Log token to check its value

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT Secret
    console.log('Decoded:', decoded); // Log the decoded token

    return decoded.user; // Assuming the JWT co ntains user information
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}
