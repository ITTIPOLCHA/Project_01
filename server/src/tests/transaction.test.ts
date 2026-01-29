import request from 'supertest';
import app from '../app';
import Transaction from '../models/Transaction';
import User from '../models/User';

// Mock models
jest.mock('../models/Transaction');
jest.mock('../models/User');

// Mock Auth Middleware
jest.mock('../middleware/authMiddleware', () => ({
    protect: (req: any, res: any, next: any) => {
        // Mock req.user
        req.user = {
            _id: '507f191e810c19729de860ea', // Valid ObjectId format
            id: '507f191e810c19729de860ea'
        };
        next();
    }
}));

describe('Transaction API', () => {
    describe('GET /api/transactions', () => {
        it('should return list of transactions', async () => {
            // Mock Transaction.find
            (Transaction.find as jest.Mock).mockResolvedValue([
                { amount: 100, category: 'Food', user: '507f191e810c19729de860ea' }
            ]);

            const res = await request(app).get('/api/transactions');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(1);
            expect(res.body.data[0].amount).toBe(100);
        });
    });
});
