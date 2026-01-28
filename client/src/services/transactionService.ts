import api from './api';
import type { ITransaction } from '../types';

const API_URL = '/transactions';

const getTransactions = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

const addTransaction = async (transactionData: Partial<ITransaction>) => {
    const response = await api.post(API_URL, transactionData);
    return response.data;
};

const deleteTransaction = async (id: string) => {
    const response = await api.delete(API_URL + '/' + id);
    return response.data;
};

const updateTransaction = async (id: string, transactionData: Partial<ITransaction>) => {
    const response = await api.put(API_URL + '/' + id, transactionData);
    return response.data;
};

const transactionService = {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
};

export default transactionService;
