// File for testing setup
const mongoose = require('mongoose');

jest.setTimeout(10000); // Increase timeout for async operations if needed

afterAll(async () => {
    await mongoose.connection.close();
});
