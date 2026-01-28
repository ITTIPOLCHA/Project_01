import express from 'express';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .delete(protect, deleteTransaction)
    .put(protect, updateTransaction);

export default router;
