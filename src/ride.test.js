const Ride = require('./ride');

test('correct e-mails', () => {
  expect(Ride.isValidEmail('test@example.com')).toBe(true);
  expect(Ride.isValidEmail('user@iu.org')).toBe(true);
  expect(Ride.isValidEmail('user+suffix@iu.org')).toBe(true);
});


test('incorrect e-mails', () => {
  expect(Ride.isValidEmail('test@example')).toBe(false);
  expect(Ride.isValidEmail('user@ iu.org')).toBe(false);
  expect(Ride.isValidEmail('user @iu.org')).toBe(false);
});