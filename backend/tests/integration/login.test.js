// Tests for login route
const request = require('supertest');
const { app } = require('../../server');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('POST /api/auth/login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a token on successful login', async () => {
        const mockUser = {
            _id: 'user123',
            email: 'test_user',
            name: 'test',
            password: 'password', 
        };

        // Mock password to return true
        bcrypt.compare.mockResolvedValue(true); // Password matches

        // Mock database query
        User.findOne.mockResolvedValue(mockUser);

        // Mock JWT token
        jwt.sign.mockReturnValue('mocked_token');

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test_user', password: 'password' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token', 'mocked_token');
    });

    it('should return an error for incorrect email', async () => {
        const mockUser = {
            _id: 'user123',
            email: 'test_user',
            name: 'test',
            password: 'password', 
        };

        bcrypt.compare.mockResolvedValue(false);
        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'wrong_email', password: 'password' });
        expect(res.statusCode).toEqual(400);
    });

    it('should return an error for incorrect password', async () => {
        const mockUser = {
            _id: 'user123',
            email: 'test_user',
            name: 'test',
            password: 'password', 
        };

        bcrypt.compare.mockResolvedValue(false);
        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test_user', password: 'wrong_password' });
        expect(res.statusCode).toEqual(400);
    });
});
