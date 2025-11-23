const { v4: uuidv4 } = require('uuid');

/**
 * Ride data type for ride share application
 */
class Ride {
  /**
   * Create a new Ride
   * @param {Object} rideData - The ride information
   * @param {Object} rideData.contact - Contact information
   * @param {string} rideData.contact.name - Contact name
   * @param {string} rideData.contact.email - Contact email
   * @param {string} rideData.contact.phone - Contact phone number
   * @param {string} rideData.startDateTime - ISO 8601 date-time string for ride start
   * @param {Object} rideData.startLocation - Starting location coordinates
   * @param {number} rideData.startLocation.lat - Latitude of start location
   * @param {number} rideData.startLocation.lng - Longitude of start location
   * @param {Object} rideData.destination - Destination coordinates
   * @param {number} rideData.destination.lat - Latitude of destination
   * @param {number} rideData.destination.lng - Longitude of destination
   * @param {number} rideData.availableSeats - Number of available seats
   */
  constructor(rideData) {
    this.id = uuidv4(); // Generate unique ID at creation time
    this.contact = {
      name: rideData.contact.name,
      email: rideData.contact.email,
      phone: rideData.contact.phone
    };
    this.startDateTime = rideData.startDateTime;
    this.startLocation = {
      lat: rideData.startLocation.lat,
      lng: rideData.startLocation.lng
    };
    this.destination = {
      lat: rideData.destination.lat,
      lng: rideData.destination.lng
    };
    this.availableSeats = rideData.availableSeats;
  }

  /**
   * Validate ride data
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    // Validate contact information
    if (!this.contact.name || typeof this.contact.name !== 'string') {
      errors.push('Contact name is required and must be a string');
    }
    if (!this.contact.email || !this.isValidEmail(this.contact.email)) {
      errors.push('Valid contact email is required');
    }
    if (!this.contact.phone || typeof this.contact.phone !== 'string') {
      errors.push('Contact phone is required and must be a string');
    }

    // Validate start date/time
    if (!this.startDateTime || isNaN(Date.parse(this.startDateTime))) {
      errors.push('Valid start date/time is required (ISO 8601 format)');
    }

    // Validate start location coordinates
    if (!this.isValidLatitude(this.startLocation.lat)) {
      errors.push('Start location latitude must be between -90 and 90');
    }
    if (!this.isValidLongitude(this.startLocation.lng)) {
      errors.push('Start location longitude must be between -180 and 180');
    }

    // Validate destination coordinates
    if (!this.isValidLatitude(this.destination.lat)) {
      errors.push('Destination latitude must be between -90 and 90');
    }
    if (!this.isValidLongitude(this.destination.lng)) {
      errors.push('Destination longitude must be between -180 and 180');
    }

    // Validate available seats
    if (!Number.isInteger(this.availableSeats) || this.availableSeats < 0) {
      errors.push('Available seats must be a non-negative integer');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate latitude
   * @param {number} lat - Latitude to validate
   * @returns {boolean} True if valid latitude
   */
  isValidLatitude(lat) {
    return typeof lat === 'number' && lat >= -90 && lat <= 90;
  }

  /**
   * Validate longitude
   * @param {number} lng - Longitude to validate
   * @returns {boolean} True if valid longitude
   */
  isValidLongitude(lng) {
    return typeof lng === 'number' && lng >= -180 && lng <= 180;
  }

  /**
   * Convert ride to JSON object
   * @returns {Object} JSON representation of the ride
   */
  toJSON() {
    return {
      id: this.id,
      contact: this.contact,
      startDateTime: this.startDateTime,
      startLocation: this.startLocation,
      destination: this.destination,
      availableSeats: this.availableSeats
    };
  }
}

module.exports = Ride;
