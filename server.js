
const express = require("express");
const bodyParser = require("body-parser");
const js2xmlparser = require("js2xmlparser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// TEMPORARY in-memory user storage (replace with DB later)
let users = [];

// JWT Secret Key
const JWT_SECRET = "mysecretkey"; // Change this in production

// REGISTER USER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  res.json({ message: "User registered successfully", user: { id: newUser.id, name, email } });
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

  // Create token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ message: "Login successful", token });
});

// MIDDLEWARE: Authenticate token
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET USER PROFILE
app.get("/profile", auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json({ id: user.id, name: user.name, email: user.email });
});

// LOGOUT USER (client deletes token)
app.post("/logout", (req, res) => {
  // With JWT, logout is handled on client
  res.json({ message: "Logout successful (token deleted on client)" });
});

// ROOM MANAGEMENT

let rooms = [
  { id: 1, name: "Deluxe", price: 200, capacity: 2 },
  { id: 2, name: "Suite", price: 350, capacity: 4 },
];

// API routes
app.get("/rooms", (req, res) => {
  if (req.headers.accept === "application/xml") {
    res.set("Content-Type", "application/xml");
    res.send(js2xmlparser.parse("rooms", rooms));
  } else {
    res.json(rooms);
  }
});

app.get("/rooms/:id", (req, res) => {
  const room = rooms.find((r) => r.id === parseInt(req.params.id));
  if (!room) return res.status(404).send({ error: "Room not found" });

  if (req.headers.accept === "application/xml") {
    res.set("Content-Type", "application/xml");
    res.send(js2xmlparser.parse("room", room));
  } else {
    res.json(room);
  }
});

app.post("/rooms", (req, res) => {
  const newRoom = { id: rooms.length + 1, ...req.body };
  rooms.push(newRoom);
  res.json(newRoom);
});

app.put("/rooms/:id", (req, res) => {
  const room = rooms.find((r) => r.id === parseInt(req.params.id));
  if (!room) return res.status(404).send({ error: "Room not found" });

  Object.assign(room, req.body);
  res.json(room);
});

app.delete("/rooms/:id", (req, res) => {
  rooms = rooms.filter((r) => r.id !== parseInt(req.params.id));
  res.json({ message: "Room deleted" });
});

// Correct port binding for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

