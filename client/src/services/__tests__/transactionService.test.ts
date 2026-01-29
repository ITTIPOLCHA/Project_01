import { describe, it, expect, vi, beforeEach } from 'vitest';
import transactionService from '../transactionService';
import api from '../api';

// Mock api
vi.mock('../api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('transactionService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getTransactions calls api.get', async () => {
        const mockData = [{ id: 1, amount: 100 }];
        (api.get as any).mockResolvedValueOnce({ data: mockData });

        const result = await transactionService.getTransactions();

        expect(api.get).toHaveBeenCalledWith('/transactions');
        expect(result).toEqual(mockData);
    });

    it('addTransaction calls api.post', async () => {
        const newTransaction = { amount: 500, category: 'Food' };
        const mockResponse = { id: 2, ...newTransaction };
        (api.post as any).mockResolvedValueOnce({ data: mockResponse });

        const result = await transactionService.addTransaction(newTransaction as any);

        expect(api.post).toHaveBeenCalledWith('/transactions', newTransaction);
        expect(result).toEqual(mockResponse);
    });

    it('deleteTransaction calls api.delete', async () => {
        const id = '123';
        (api.delete as any).mockResolvedValueOnce({ data: { success: true } });

        await transactionService.deleteTransaction(id);

        expect(api.delete).toHaveBeenCalledWith(`/transactions/${id}`);
    });
});
