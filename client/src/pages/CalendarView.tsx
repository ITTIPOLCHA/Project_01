import React, { useEffect, useState } from 'react';
import { Calendar, Badge, message, Modal, List } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import transactionService from '../services/transactionService';
import type { ITransaction } from '../types';

const CalendarView: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await transactionService.getTransactions();
                setTransactions(res.data);
            } catch (error) {
                message.error('Failed to load transactions');
            }
        };
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getListData = (value: Dayjs) => {
        return transactions.filter(t => dayjs(t.date).isSame(value, 'day'));
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {listData.map((item) => (
                    <li key={item._id}>
                        <Badge status={item.type === 'income' ? 'success' : 'error'} text={`$${item.amount}`} />
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (newValue: Dayjs) => {
        const listData = getListData(newValue);
        if (listData.length > 0) {
            setSelectedDate(newValue);
            setIsModalVisible(true);
        }
    };

    return (
        <>
            <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />

            <Modal
                title={`Transactions on ${selectedDate?.format('YYYY-MM-DD')}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedDate ? getListData(selectedDate) : []}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Badge status={item.type === 'income' ? 'success' : 'error'} />}
                                title={`${item.type.toUpperCase()} - $${item.amount}`}
                                description={item.description || item.category}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default CalendarView;
