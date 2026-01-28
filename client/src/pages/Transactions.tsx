import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import transactionService from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';
import type { ITransaction } from '../types';
import dayjs from 'dayjs';

const { Title } = Typography;

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Partial<ITransaction> | undefined>(undefined);
    const [formLoading, setFormLoading] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await transactionService.getTransactions();
            setTransactions(res.data);
        } catch {
            message.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAdd = () => {
        setEditingTransaction(undefined);
        setIsModalVisible(true);
    };

    const handleEdit = (record: ITransaction) => {
        setEditingTransaction(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await transactionService.deleteTransaction(id);
            message.success('Transaction deleted');
            fetchTransactions();
        } catch {
            message.error('Failed to delete transaction');
        }
    };

    const handleFormFinish = async (values: any) => {
        setFormLoading(true);
        try {
            if (editingTransaction && editingTransaction._id) {
                await transactionService.updateTransaction(editingTransaction._id, values);
                message.success('Transaction updated');
            } else {
                await transactionService.addTransaction(values);
                message.success('Transaction added');
            }
            setIsModalVisible(false);
            fetchTransactions();
        } catch {
            message.error('Operation failed');
        } finally {
            setFormLoading(false);
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
            onFilter: (value: any, record: ITransaction) => record.type === value,
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
            render: (_: any, record: ITransaction) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Transactions</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Transaction
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={transactions}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <TransactionForm
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onFinish={handleFormFinish}
                initialValues={editingTransaction}
                loading={formLoading}
            />
        </div>
    );
};

export default Transactions;
