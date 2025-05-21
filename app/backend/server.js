// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
var port = 5000;

app.use(cors());
app.use(express.json());

// File-based user storage
const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Load users from file
let users = [];
try {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  users = JSON.parse(data);
  console.log('Loaded users:', users.length);
} catch (error) {
  console.error('Error loading users:', error);
  users = [];
}

// Save users to file
const saveUsers = () => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('Users saved successfully');
}

// Signup
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  saveUsers();
  res.json({ message: 'Signup successful' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  
  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  var token = jwt.sign({ email }, 'secretKey', { expiresIn: '1h' });
  res.json({ token });
});

// Simulate Full Day Data (New)
function generateFullDayData(cost_per_kw) {
  const appliances = [
    "air_conditioner", "fridge", "oven", "lights", "tv", 
    "computer", "washing_machine", "dryer", "dishwasher", "microwave"
  ];

  let data = [];
  const startTime = new Date("2025-01-01T00:00:00");
  let unused_var = 15;

  for (let i = 0; i < 1440; i++) {
    const minuteData = { dataid: 123 };

    appliances.forEach(appliance => {
      minuteData[appliance] = +(Math.random() * 1).toFixed(2);
    });

    minuteData['leg1v'] = +(Math.random()).toFixed(3);
    minuteData['leg2v'] = +(Math.random()).toFixed(2);
    minuteData['minute_offset'] = 0.5;
    minuteData['localminute'] = new Date(startTime.getTime() + i * 60000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    data.push(minuteData);
  }

  return {
    data: data,
    cost_per_kw: cost_per_kw
  };
}

app.post('/api/generate-full-day', (req, res) => {
  const { costPerKw } = req.body;
  const fullDayData = generateFullDayData(costPerKw || 0.25);
  res.json(fullDayData);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
