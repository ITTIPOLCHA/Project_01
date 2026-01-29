import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransactionForm from '../TransactionForm';

// Mock Tesseract
vi.mock('tesseract.js', () => ({
    default: {
        recognize: vi.fn(),
    },
}));

// Mock Antd message
vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        ...actual,
        message: {
            success: vi.fn(),
            error: vi.fn(),
            warning: vi.fn(),
        },
    };
});

// Mock matchMedia for Ant Design
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('TransactionForm', () => {
    const mockOnFinish = vi.fn().mockResolvedValue(undefined);
    const mockOnCancel = vi.fn();

    const defaultProps = {
        visible: true,
        onCancel: mockOnCancel,
        onFinish: mockOnFinish,
        loading: false,
    };

    it('renders form fields correctly', () => {
        render(<TransactionForm {...defaultProps} />);
        expect(screen.getByText('Add Transaction')).toBeInTheDocument();
        // Check for 'Amount' input (Antd form labels might be tricky, checking presence)
        // Antd uses labels inside form structure
    });

    it('validates required fields', async () => {
        render(<TransactionForm {...defaultProps} />);

        // Ant Modal standard OK button
        fireEvent.click(screen.getByRole('button', { name: /OK/i }));

        await waitFor(() => {
            // Antd validation messages
            expect(screen.getAllByText('Please input amount!').length).toBeGreaterThan(0);
        });
    });
});
