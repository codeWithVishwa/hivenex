import jwt from "jsonwebtoken";

function readToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

// Verify JWT and attach req.user = { id, username, role }
export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Verify JWT and require one of the given roles
export function requireRole(...roles) {
  return (req, res, next) => {
    const token = readToken(req);
    if (!token)
      return res.status(401).json({ error: "Authentication required" });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = payload;
    if (!roles.includes(payload.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
