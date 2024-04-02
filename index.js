// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], 
  };
  
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3303
const SECRET_KEY = 'JEEVAN'; 

mongoose.connect('mongodb+srv://priyakiruthi21:dY4cnxHusMnhkxSD@kiruthidb.ci4cnyg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Hashed password
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name,email,password);
    
    // Check if required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error signing up' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'No User Found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const jwt_token = jwt.sign({ userId: user._id }, SECRET_KEY);
    res.json({ jwt_token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/',async(req,res)=>{
  res.send("vanakkam from JK")
})