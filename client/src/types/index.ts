export interface IUser {
    _id: string;
    username: string;
    email: string;
    token: string;
}

export interface ITransaction {
    _id: string;
    text: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
    createdAt: string;
}
