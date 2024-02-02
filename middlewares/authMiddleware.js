const jwt = require("jsonwebtoken");
const secretKey = require("../secretKey");

const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

function generateToken(user) {
  const payload = { id: user.id, username: user.username };
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secretKey, options);
}

function loginMiddleware(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password must be provided." });
  }

  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const token = generateToken(user);
  res.locals.token = token;
  next();
}

module.exports = { loginMiddleware };
