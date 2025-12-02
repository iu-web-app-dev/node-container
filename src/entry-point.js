const { app } = require('./server');

const PORT = 8081;

// Start the server
app.listen(PORT, () => {
  console.log(`REST API server running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/v1/rides`);
});