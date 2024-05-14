import { JwtPayload } from 'jsonwebtoken' // Importing JwtPayload type from jsonwebtoken

// Interface extending JwtPayload to include userId and email
export interface AuthPayload extends JwtPayload {
  userId: string // User ID
  email: string // User email
}
