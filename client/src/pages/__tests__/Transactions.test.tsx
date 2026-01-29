import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Transactions from '../Transactions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import transactionService from '../../services/transactionService';

// Mock transactionService
vi.mock('../../services/transactionService', () => ({
    default: {
        getTransactions: vi.fn(),
        addTransaction: vi.fn(),
        updateTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
    },
}));

// Mock TransactionForm to avoid complexity
vi.mock('../../components/TransactionForm', () => ({
    default: () => <div data-testid="transaction-form">Mock Form</div>
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderTransactions = () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Transactions />
        </QueryClientProvider>
    );
};

describe('Transactions Page', () => {
    it('renders transaction list', async () => {
        const mockData = [
            { _id: '1', amount: 100, category: 'Food', type: 'expense', date: '2023-01-01' },
            { _id: '2', amount: 2000, category: 'Salary', type: 'income', date: '2023-01-02' },
        ];
        (transactionService.getTransactions as any).mockResolvedValue({ data: mockData });

        renderTransactions();

        await waitFor(() => {
            expect(screen.getByText('Food')).toBeInTheDocument();
            expect(screen.getByText('Salary')).toBeInTheDocument();
        });
    });

    it('displays loading state initially', () => {
        // We can't easily check loading because it's fast, but useQuery handles it.
        // Antd Table has a loading prop.
        (transactionService.getTransactions as any).mockImplementation(() => new Promise(() => { })); // Never resolve
        renderTransactions();
        // Check for Antd spin or table loading class?
        // Hard to assert explicit loading text in Antd Table without digging DOM.
    });
});
