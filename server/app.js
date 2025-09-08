require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const usersRoutes = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cors());

// DB
connectDB(process.env.MONGO_URI);

// routes
app.use('/api/users', usersRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on ${port}`));
