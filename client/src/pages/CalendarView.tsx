import React, { useState } from 'react';
import { Calendar, Badge, Modal, List } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import transactionService from '../services/transactionService';
import type { ITransaction } from '../types';

const CalendarView: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data: transactions = [] } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await transactionService.getTransactions();
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const getListData = (value: Dayjs) => {
        return transactions.filter((t: ITransaction) => dayjs(t.date).isSame(value, 'day'));
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {listData.map((item: ITransaction) => (
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
        <div style={{ width: '100%', overflow: 'auto' }}>
            <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />

            <Modal
                title={`Transactions on ${selectedDate?.format('YYYY-MM-DD')}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnHidden={true}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedDate ? getListData(selectedDate) : []}
                    renderItem={(item: ITransaction) => (
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
        </div>
    );
};

export default CalendarView;
