// =======================
// Import dependencies
// =======================
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Initialize Express app
// =======================
const app = express();
app.use(cors());
app.use(bodyParser.json());

// =======================
// JWT Secret Key
// =======================
const JWT_SECRET = "your_jwt_secret"; // replace with a secure secret in production

// =======================
// In-memory storage
// =======================
let users = [];
let rooms = [
  {
    id: 1,
    room_number: "101",
    room_type: "Deluxe",
    capacity: 2,
    description: "A cozy deluxe room",
    price: 200,
    status: "available",
  },
  {
    id: 2,
    room_number: "102",
    room_type: "Suite",
    capacity: 4,
    description: "Spacious suite with sea view",
    price: 350,
    status: "available",
  },
];

// =======================
// Middleware: Authentication
// =======================
const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// =======================
// Routes
// =======================

// REGISTER USER
app.post("/register", async (req, res) => {
  const { first_name, last_name, username, email, mobile_number, address, user_type, password } = req.body;

  if (!first_name || !last_name || !username || !email || !mobile_number || !address || !user_type || !password)
    return res.status(400).json({ error: "All fields are required" });

  const existing = users.find((u) => u.email === email || u.username === username);
  if (existing) return res.status(400).json({ error: "Email or username already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    first_name,
    last_name,
    username,
    email,
    mobile_number,
    address,
    user_type,
    password: hashedPassword,
  };

  users.push(newUser);

  res.json({ message: "User registered successfully", user: { id: newUser.id, first_name, last_name, username, email } });
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// GET USER PROFILE
app.get("/profile", auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    mobile_number: user.mobile_number,
    address: user.address,
    user_type: user.user_type,
  });
});

// LOGOUT USER (dummy endpoint since JWT is stateless)
app.post("/logout", auth, (req, res) => {
  res.json({ message: "Logout successful (delete token client-side)" });
});

// =======================
// ROOM MANAGEMENT
// =======================

// GET ALL ROOMS
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

// GET SINGLE ROOM
app.get("/rooms/:id", (req, res) => {
  const room = rooms.find((r) => r.id === parseInt(req.params.id));
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

// CREATE ROOM
app.post("/rooms", (req, res) => {
  const { room_number, room_type, capacity, description, price, status } = req.body;
  if (!room_number || !room_type || !capacity || !description || !price || !status)
    return res.status(400).json({ error: "All fields are required" });

  const newRoom = { id: rooms.length + 1, room_number, room_type, capacity, description, price, status };
  rooms.push(newRoom);
  res.json(newRoom);
});

// UPDATE ROOM
app.put("/rooms/:id", (req, res) => {
  const room = rooms.find((r) => r.id === parseInt(req.params.id));
  if (!room) return res.status(404).json({ error: "Room not found" });

  Object.assign(room, req.body);
  res.json(room);
});

// DELETE ROOM
app.delete("/rooms/:id", (req, res) => {
  const index = rooms.findIndex((r) => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Room not found" });

  const deleted = rooms.splice(index, 1);
  res.json({ message: "Room deleted", room: deleted[0] });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
