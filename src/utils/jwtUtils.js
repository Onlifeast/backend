import jsonwebtoken from "jsonwebtoken";

export function generateToken(payload, secret) {
  return jsonwebtoken.sign(payload, secret, { expiresIn: "3d" });
}


export function verifyToken(token, secret) {
  return jsonwebtoken.verify(token, secret);
}
