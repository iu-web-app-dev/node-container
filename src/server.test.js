const request = require('supertest');
const { app } = require('./server');
const http = require('http');

const srv = app.listen(0); // Listen on a random available port

afterAll(() => {
  srv.close();
});

describe('GET /v1/rides', () => {
  test('should return empty ride list', async () => {
    const res = await request(srv).get('/v1/rides');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Ride lifecycle: create, list, book, delete', () => {
  test('should create a ride, list it, book a seat, and delete it', async () => {
    // Step 1: Create a new ride
    const newRide = {
      contact: {
        name: 'Max Mustermann',
        email: 'max@example.com',
        phone: '+49-30-1234567'
      },
      startDateTime: '2026-05-20T09:00:00Z',
      startTown: 'Berlin',
      destinationTown: 'Hamburg',
      availableSeats: 4
    };

    const createRes = await request(srv)
      .post('/v1/rides')
      .send(newRide);

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.ride).toHaveProperty('id');
    expect(createRes.body.ride.contact.name).toBe('Max Mustermann');
    expect(createRes.body.ride.availableSeats).toBe(4);
    expect(createRes.body.ride.startTown).toBe('Berlin');
    expect(createRes.body.ride.destinationTown).toBe('Hamburg');

    const rideId = createRes.body.ride.id;

    // Step 2: Check the ride list
    const listRes = await request(srv).get('/v1/rides');
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.length).toBeGreaterThan(0);
    const ride = listRes.body.find(r => r.id === rideId);
    expect(ride).toBeDefined();
    expect(ride.availableSeats).toBe(4);

    // Step 3: Book a seat (decrease availableSeats)
    const updatedRide = {
      contact: {
        name: 'Max Mustermann',
        email: 'max@example.com',
        phone: '+49-30-1234567'
      },
      startDateTime: '2026-05-20T09:00:00Z',
      startTown: 'Berlin',
      destinationTown: 'Hamburg',
      availableSeats: 3  // One seat booked
    };

    const updateRes = await request(srv)
      .put(`/v1/rides/${rideId}`)
      .send(updatedRide);

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.ride.availableSeats).toBe(3);

    // Step 4: Delete the ride
    const deleteRes = await request(srv).delete(`/v1/rides/${rideId}`);
    expect(deleteRes.statusCode).toBe(200);

    // Step 5: Verify the ride is deleted
    const getRes = await request(srv).get(`/v1/rides/${rideId}`);
    expect(getRes.statusCode).toBe(404);
  });
});

describe('Ride validation', () => {
  test('should reject ride with missing contact name', async () => {
    const incompleteRide = {
      contact: {
        email: 'max@example.com'
        // name is missing
      },
      startDateTime: '2026-05-20T09:00:00Z',
      startTown: 'Berlin',
      destinationTown: 'Hamburg',
      availableSeats: 3
    };

    const res = await request(srv)
      .post('/v1/rides')
      .send(incompleteRide);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid ride data');
    expect(res.body.details).toContain('Contact name is required and must be a string');
  });

  test('should reject ride with invalid email', async () => {
    const invalidRide = {
      contact: {
        name: 'Max Mustermann',
        email: 'not-an-email'
      },
      startDateTime: '2026-05-20T09:00:00Z',
      startTown: 'Berlin',
      destinationTown: 'Hamburg',
      availableSeats: 3
    };

    const res = await request(srv)
      .post('/v1/rides')
      .send(invalidRide);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid ride data');
    expect(res.body.details).toContain('Contact email must be a valid email address when provided');
  });

  test('should reject ride with missing start town', async () => {
    const incompleteRide = {
      contact: {
        name: 'Max Mustermann'
      },
      startDateTime: '2026-05-20T09:00:00Z',
      // startTown is missing
      destinationTown: 'Hamburg',
      availableSeats: 3
    };

    const res = await request(srv)
      .post('/v1/rides')
      .send(incompleteRide);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid ride data');
    expect(res.body.details).toContain('Start town is required and must be a string');
  });

  test('should reject ride with invalid available seats', async () => {
    const invalidRide = {
      contact: {
        name: 'Max Mustermann'
      },
      startDateTime: '2026-05-20T09:00:00Z',
      startTown: 'Berlin',
      destinationTown: 'Hamburg',
      availableSeats: -1  // Negative seats
    };

    const res = await request(srv)
      .post('/v1/rides')
      .send(invalidRide);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid ride data');
    expect(res.body.details).toContain('Available seats must be a non-negative integer');
  });

  test('should reject ride with invalid date format', async () => {
    const invalidRide = {
      contact: {
        name: 'Max Mustermann'
      },
      startDateTime: 'not-a-date',
      startTown: 'Berlin',
      destinationTown: 'Hamburg',
      availableSeats: 2
    };

    const res = await request(srv)
      .post('/v1/rides')
      .send(invalidRide);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid ride data');
    expect(res.body.details).toContain('Valid start date/time is required (ISO 8601 format)');
  });

});


