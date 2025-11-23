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
   * @param {string} rideData.startTown - Starting town
   * @param {string} rideData.destinationTown - Destination town
   * @param {number} rideData.availableSeats - Number of available seats
   */
  constructor(rideData) {
    this.id = uuidv4(); // Generate unique ID at creation time
    const contact = rideData.contact || {}; // allow missing contact object
    this.contact = {
      name: contact.name, // still required; validated later
      email: contact.email ?? null,
      phone: contact.phone ?? null
    };
    this.startDateTime = rideData.startDateTime;
    this.startTown = rideData.startTown;
    this.destinationTown = rideData.destinationTown;
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
    // Optional email: validate only if provided (non-null / non-empty)
    if (this.contact.email !== null && this.contact.email !== undefined && this.contact.email !== '') {
      if (!this.isValidEmail(this.contact.email)) {
        errors.push('Contact email must be a valid email address when provided');
      }
    }
    // Optional phone: validate only if provided (non-null / non-empty)
    if (this.contact.phone !== null && this.contact.phone !== undefined && this.contact.phone !== '') {
      if (typeof this.contact.phone !== 'string') {
        errors.push('Contact phone must be a string when provided');
      }
    }

    // Validate start date/time
    if (!this.startDateTime || isNaN(Date.parse(this.startDateTime))) {
      errors.push('Valid start date/time is required (ISO 8601 format)');
    }

    // Validate towns (simple non-empty string check)
    if (!this.startTown || typeof this.startTown !== 'string') {
      errors.push('Start town is required and must be a string');
    }
    if (!this.destinationTown || typeof this.destinationTown !== 'string') {
      errors.push('Destination town is required and must be a string');
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

  // Coordinate validation helpers removed (town-based model)

  /**
   * Convert ride to JSON object
   * @returns {Object} JSON representation of the ride
   */
  toJSON() {
    return {
      id: this.id,
      contact: this.contact,
      startDateTime: this.startDateTime,
      startTown: this.startTown,
      destinationTown: this.destinationTown,
      availableSeats: this.availableSeats
    };
  }
}

module.exports = Ride;
