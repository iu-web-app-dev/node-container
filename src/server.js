const express = require('express');
const Ride = require('./ride');
const app = express();
const PORT = 8081;

// Middleware to parse JSON
app.use(express.json());

// In-memory storage for rides (in production, use a database)
const rides = [];

// v1/list endpoint that returns all rides
app.get('/v1/list', (req, res) => {
  res.json(rides);
});

// v1/ride endpoint to create a new ride
app.post('/v1/ride', (req, res) => {
  try {
    const ride = new Ride(req.body);
    const validation = ride.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid ride data',
        details: validation.errors
      });
    }
    
    rides.push(ride.toJSON());
    res.status(201).json({
      message: 'Ride created successfully',
      ride: ride.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create ride',
      details: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`REST API server running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/v1/list`);
});
