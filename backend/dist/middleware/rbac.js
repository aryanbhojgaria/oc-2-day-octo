"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: "Authentication required." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=rbac.js.map