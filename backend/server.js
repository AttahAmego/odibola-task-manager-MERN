const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();

// Use CORS - allow requests from your frontend
app.use(cors({
  origin: 'https://odibola-task-frontend.onrender.com',
  credentials: true
}));

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Odibola Task Manager API running...');
});

// API routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
