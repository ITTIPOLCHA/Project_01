import React, { useState } from 'react';
import { Table, Button, Space, Typography, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionService from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';
import type { ITransaction } from '../types';
import dayjs from 'dayjs';

const { Title } = Typography;

const Transactions: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Partial<ITransaction> | undefined>(undefined);

    // Query for fetching transactions
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await transactionService.getTransactions();
            return res.data;
        }
    });

    // Mutation for adding transaction
    const addMutation = useMutation({
        mutationFn: transactionService.addTransaction,
        onSuccess: () => {
            message.success('Transaction added');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            setIsModalVisible(false);
        },
        onError: () => {
            message.error('Failed to add transaction');
        }
    });

    // Mutation for updating transaction
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ITransaction> }) =>
            transactionService.updateTransaction(id, data),
        onSuccess: () => {
            message.success('Transaction updated');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            setIsModalVisible(false);
        },
        onError: () => {
            message.error('Failed to update transaction');
        }
    });

    // Mutation for deleting transaction
    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.deleteTransaction(id),
        onSuccess: () => {
            message.success('Transaction deleted');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            message.error('Failed to delete transaction');
        }
    });

    const handleAdd = () => {
        setEditingTransaction(undefined);
        setIsModalVisible(true);
    };

    const handleEdit = (record: ITransaction) => {
        setEditingTransaction(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const handleFormFinish = async (values: Omit<ITransaction, '_id' | 'date' | 'createdAt'>) => {
        if (editingTransaction && editingTransaction._id) {
            await updateMutation.mutateAsync({ id: editingTransaction._id, data: values });
        } else {
            await addMutation.mutateAsync(values as unknown as ITransaction);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
            sorter: (a: ITransaction, b: ITransaction) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'income' ? 'green' : 'red'}>
                    {type.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Income', value: 'income' },
                { text: 'Expense', value: 'expense' },
            ],
            onFilter: (value: boolean | React.Key, record: ITransaction) => record.type === value,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: ITransaction) => (
                <span style={{ color: record.type === 'income' ? 'green' : 'red' }}>
                    {record.type === 'income' ? '+' : '-'} ${amount}
                </span>
            ),
            sorter: (a: ITransaction, b: ITransaction) => a.amount - b.amount,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: ITransaction) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger loading={deleteMutation.isPending && deleteMutation.variables === record._id} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <Title level={3} style={{ margin: 0 }}>Transactions</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Transaction
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={transactions}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
            />

            <TransactionForm
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onFinish={handleFormFinish}
                initialValues={editingTransaction}
                loading={addMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Transactions;
