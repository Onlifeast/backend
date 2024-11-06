import jsonwebtoken from "jsonwebtoken";

interface TokenPayload {
  id: string;
  [key: string]: any;
}

export function generateToken(payload: TokenPayload, secret: string): string {
  return jsonwebtoken.sign(payload, secret, { expiresIn: "3d" });
}

export function verifyToken(token: string, secret: string): TokenPayload {
  return jsonwebtoken.verify(token, secret) as TokenPayload;
}
