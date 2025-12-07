
// TEMPORARY in-memory storage
let users = [];

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

// ROOM MANAGEMENT
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

// POST /rooms
app.post("/rooms", (req, res) => {
  const { room_number, room_type, capacity, description, price, status } = req.body;
  if (!room_number || !room_type || !capacity || !description || !price || !status)
    return res.status(400).json({ error: "All fields are required" });

  const newRoom = { id: rooms.length + 1, room_number, room_type, capacity, description, price, status };
  rooms.push(newRoom);
  res.json(newRoom);
});

// PUT /rooms/:id
app.put("/rooms/:id", (req, res) => {
  const room = rooms.find((r) => r.id === parseInt(req.params.id));
  if (!room) return res.status(404).json({ error: "Room not found" });

  Object.assign(room, req.body);
  res.json(room);
});
