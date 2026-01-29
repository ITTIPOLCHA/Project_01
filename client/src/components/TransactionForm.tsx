import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Modal, Upload, Button, message, Spin } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import type { ITransaction } from '../types';
import { parseReceiptImage } from '../utils/receiptParser';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../utils/constants';


interface TransactionFormProps {
    visible: boolean;
    onCancel: () => void;
    onFinish: (values: Omit<ITransaction, '_id' | 'date' | 'createdAt'>) => Promise<void>;
    initialValues?: Partial<ITransaction>;
    loading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
    visible,
    onCancel,
    onFinish,
    initialValues,
    loading,
}) => {
    const [form] = Form.useForm();
    const [scanning, setScanning] = useState(false);

    // Reset form when visible changes or initialValues changes
    React.useEffect(() => {
        if (visible) {
            form.resetFields();
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                });
            }
        }
    }, [visible, initialValues, form]);

    const handleScan = async (file: File) => {
        setScanning(true);
        try {
            const { amount, recipientName } = await parseReceiptImage(file);

            if (amount <= 0) {
                message.warning('ไม่สามารถอ่านจำนวนเงินจากสลิปได้');
                setScanning(false);
                return false;
            }

            // Create transaction data and submit directly
            const transactionData = {
                type: 'expense' as const,
                amount: amount,
                category: 'สลิป',
                description: recipientName || 'สลิปโอนเงิน',
                text: recipientName || 'สลิปโอนเงิน' // Should likely use the raw text or duplicate description? ITransaction defines 'text' and 'description'.
            };

            message.success(`บันทึกสลิป: ${amount} บาท - ${recipientName || 'สลิปโอนเงิน'}`);
            setScanning(false);

            // Close modal and submit
            await onFinish(transactionData);

        } catch (error) {
            console.error(error);
            message.error('ไม่สามารถอ่านสลิปได้');
            setScanning(false);
        }
        return false; // Prevent upload
    };

    const beforeUpload = (file: File) => {
        handleScan(file);
        return false; // Prevent default upload behavior
    };

    return (
        <Modal
            title={initialValues ? "Edit Transaction" : "Add Transaction"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
        >
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                    <Button icon={<CameraOutlined />} loading={scanning}>
                        {scanning ? 'Scanning...' : 'Scan Receipt'}
                    </Button>
                </Upload>
            </div>

            <Spin spinning={scanning} tip="Reading Receipt...">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ type: 'expense' }}
                >
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select type!' }]}
                    >
                        <Select>
                            {TRANSACTION_TYPES.map(type => (
                                <Select.Option key={type.value} value={type.value}>{type.label}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please input amount!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')} />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please input category!' }]}
                    >
                        <Select showSearch>
                            {TRANSACTION_CATEGORIES.map(cat => (
                                <Select.Option key={cat.value} value={cat.value}>{cat.label}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default TransactionForm;
