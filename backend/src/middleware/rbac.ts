import { Request, Response, NextFunction } from "express"

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: "Authentication required." })
            return
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
            })
            return
        }

        next()
    }
}
