import React, { useMemo } from 'react';
import { Card, Col, Row, Statistic, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import transactionService from '../services/transactionService';
import type { ITransaction } from '../types';

const Dashboard: React.FC = () => {

    // Fetch transactions using React Query
    const { data: transactions = [], isError } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await transactionService.getTransactions();
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 mins (or until invalidated)
    });

    if (isError) {
        message.error('Failed to load dashboard data');
    }

    // Calculate statistics using useMemo to avoid re-calculation on every render
    const { income, expense, balance } = useMemo(() => {
        const inc = transactions.filter((t: ITransaction) => t.type === 'income').reduce((acc: number, t: ITransaction) => acc + t.amount, 0);
        const exp = transactions.filter((t: ITransaction) => t.type === 'expense').reduce((acc: number, t: ITransaction) => acc + t.amount, 0);
        return {
            income: inc,
            expense: exp,
            balance: inc - exp
        };
    }, [transactions]);

    return (
        <div>
            <h2 style={{ marginBottom: 20 }}>Dashboard</h2>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Balance"
                            value={balance}
                            precision={2}
                            valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Income"
                            value={income}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Expense"
                            value={expense}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
