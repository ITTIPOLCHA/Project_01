import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import transactionService from '../services/transactionService';
import type { ITransaction } from '../types';

const Dashboard: React.FC = () => {
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await transactionService.getTransactions();
                const txs = res.data;
                // setTransactions(txs); // Removed unused state set

                const inc = txs.filter((t: ITransaction) => t.type === 'income').reduce((acc: number, t: ITransaction) => acc + t.amount, 0);
                const exp = txs.filter((t: ITransaction) => t.type === 'expense').reduce((acc: number, t: ITransaction) => acc + t.amount, 0);

                setIncome(inc);
                setExpense(exp);
                setBalance(inc - exp);
            } catch {
                message.error('Failed to load data');
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2 style={{ marginBottom: 20 }}>Dashboard</h2>
            <Row gutter={16}>
                <Col span={8}>
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
                <Col span={8}>
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
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Exprnse"
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
