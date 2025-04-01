const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const districtRoutes = require('./routes/districtRoutes');
const blockRoutes = require('./routes/blockRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/districts', districtRoutes);
app.use('/api/blocks', blockRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Chhattisgarh Districts and Blocks API');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});