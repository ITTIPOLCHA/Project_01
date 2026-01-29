import request from 'supertest';
import app from '../app';
import User from '../models/User';

jest.mock('../models/User');

describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            // Mock findOne (User does not exist)
            (User.findOne as jest.Mock).mockResolvedValue(null);

            // Mock create to return a user object
            (User.create as jest.Mock).mockResolvedValue({
                id: '123',
                _id: '123', // Ensure _id works if used
                username: 'Test User',
                email: 'test@example.com',
                matchPassword: jest.fn().mockReturnValue(true),
            });

            // Note: Controller expects { username, email, password }
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.username).toBe('Test User');
        });
    });
});
