const express = require('express');
const app = express();
const PORT = 8081;

// Middleware to parse JSON
app.use(express.json());

// v1/list endpoint that returns an empty array
app.get('/v1/list', (req, res) => {
  res.json([]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`REST API server running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/v1/list`);
});
