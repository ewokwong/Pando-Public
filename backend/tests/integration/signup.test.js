// Tests for signup route
const request = require('supertest');
const User = require('../../models/User');
const { app } = require('../../server');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('POST /api/auth/signup', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a token on successful signup', async () => {

        // Mock JWT token
        jwt.sign.mockReturnValue('mocked_token');

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@email.com',
                name: 'test',
                dob: '1990-05-15',
                password: '123',
                confirmPassword: '123'
            });
        
        // Expects a 201 with a returned token
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token', 'mocked_token');
    });

    it('should return an error for an invalid email', async () => {
        const mockUser = {
            email: 'test',
            name: 'test',
            password: 'password',
            confirmPassword: '123'
        };

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test',
                name: 'test',
                dob: '1990-05-15',
                password: '123',
                confirmPassword: '123'
            });

        // Should return a 400
        expect(res.statusCode).toBe(400);
    });

    it('should return an error if the email is already taken', async () => {
        const mockUser = {
            email: 'test',
            name: 'test',
            dob: '1990-05-15',
            password: 'password',
            confirmPassword: '123'
        };

        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test',
                name: 'test',
                dob: '1990-05-15',
                password: '123',
                confirmPassword: '123'
            });

        // Should return a 400
        expect(res.statusCode).toBe(400);
    });

    it('should return an error if the email field is empty', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: '',
                name: 'test',
                dob: '1990-05-15',
                password: '123',
                confirmPassword: '123'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A valid email is required');
    });

    it('should return an error if the name field is empty', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@email.com',
                name: '',
                dob: '1990-05-15',
                password: '123',
                confirmPassword: '123'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A name is required');
    });

    it('should return an error if the password field is blank', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@email.com',
                name: 'test',
                dob: '1990-05-15',
                password: '',
                confirmPassword: '123'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A password is required');
    });

    it('should return an error if confirm password does not match password', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@email.com',
                name: 'test',
                dob: '1990-05-15',
                password: '123',
                confirmPassword: '456',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Passwords do not match');
    });

});
