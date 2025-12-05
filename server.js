const express = require("express");
const bodyParser = require("body-parser");
const js2xmlparser = require("js2xmlparser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- API data ---
let rooms = [
  { id: 1, name: "Deluxe", price: 200, capacity: 2 },
  { id: 2, name: "Suite", price: 350, capacity: 4 },
];

// --- API routes ---
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

// --- Serve frontend (Vite build) ---
app.use(express.static(path.join(__dirname, "public"))); // adjust if your build folder differs

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

