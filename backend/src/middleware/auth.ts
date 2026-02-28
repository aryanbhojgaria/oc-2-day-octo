import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface JwtPayload {
    userId: string
    role: string
    email: string
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token provided. Please sign in." })
        return
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        req.user = payload
        next()
    } catch {
        res.status(401).json({ error: "Invalid or expired token. Please sign in again." })
    }
}
