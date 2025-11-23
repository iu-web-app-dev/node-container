const express = require('express');
const Ride = require('./ride');
const app = express();
const PORT = 8081;

// Middleware to parse JSON
app.use(express.json());

// In-memory storage for rides using a dictionary for fast ID-based access
const rides = {};

// v1/list endpoint that returns all rides
app.get('/v1/list', (req, res) => {
  res.json(Object.values(rides));
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
    
    const rideJSON = ride.toJSON();
    rides[ride.id] = rideJSON; // Store in dictionary using ID as key
    
    res.status(201).json({
      message: 'Ride created successfully',
      ride: rideJSON
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create ride',
      details: error.message
    });
  }
});

// v1/ride/:id endpoint to get a specific ride by ID
app.get('/v1/ride/:id', (req, res) => {
  const ride = rides[req.params.id];
  
  if (!ride) {
    return res.status(404).json({
      error: 'Ride not found'
    });
  }
  
  res.json(ride);
});

// v1/ride/:id endpoint to update a ride by ID
app.put('/v1/ride/:id', (req, res) => {
  const existingRide = rides[req.params.id];
  
  if (!existingRide) {
    return res.status(404).json({
      error: 'Ride not found'
    });
  }
  
  try {
    const ride = new Ride(req.body);
    const validation = ride.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid ride data',
        details: validation.errors
      });
    }
    
    const rideJSON = ride.toJSON();
    // Keep the original ID
    rideJSON.id = req.params.id;
    rides[req.params.id] = rideJSON;
    
    res.json({
      message: 'Ride updated successfully',
      ride: rideJSON
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to update ride',
      details: error.message
    });
  }
});

// v1/ride/:id endpoint to delete a ride by ID
app.delete('/v1/ride/:id', (req, res) => {
  const ride = rides[req.params.id];
  
  if (!ride) {
    return res.status(404).json({
      error: 'Ride not found'
    });
  }
  
  delete rides[req.params.id];
  
  res.json({
    message: 'Ride deleted successfully',
    ride: ride
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`REST API server running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/v1/list`);
});
