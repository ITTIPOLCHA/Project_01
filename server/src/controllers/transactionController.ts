import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text, amount } = req.body; // text/description mapped to description in model? Check model.
        // Model has: type, amount, category, description, date

        const transaction = await Transaction.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        if ((error as any).name === 'ValidationError') {
            const messages = Object.values((error as any).errors).map((val: any) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Server Error',
            });
        }
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404).json({
                success: false,
                error: 'No transaction found',
            });
            return;
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            res.status(401).json({
                success: false,
                error: 'User not authorized',
            });
            return;
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404).json({
                success: false,
                error: 'No transaction found',
            });
            return;
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            res.status(401).json({
                success: false,
                error: 'User not authorized',
            });
            return;
        }

        transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
}
