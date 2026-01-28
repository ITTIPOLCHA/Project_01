import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    user: mongoose.Schema.Types.ObjectId;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: Date;
}

const TransactionSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
