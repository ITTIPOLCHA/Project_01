import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Modal, Upload, Button, message, Spin } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import Tesseract from 'tesseract.js';
import type { ITransaction } from '../types';

interface TransactionFormProps {
    visible: boolean;
    onCancel: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinish: (values: any) => void;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (file: any) => {
        setScanning(true);
        try {
            const result = await Tesseract.recognize(file, 'eng', {
                logger: m => console.log(m)
            });
            const text = result.data.text;
            console.log('OCR Text:', text);

            // Simple Regex to find amount (e.g., 100.00, 1,200.50)
            const amountMatch = text.match(/[\d,]+\.\d{2}/);
            if (amountMatch) {
                const amount = parseFloat(amountMatch[0].replace(/,/g, ''));
                form.setFieldsValue({ amount });
                message.success(`Detected Amount: ${amount}`);
            } else {
                message.warning('Could not detect amount automatically');
            }

            // Keyword matching for category
            const lowerText = text.toLowerCase();
            if (lowerText.includes('food') || lowerText.includes('restaurant') || lowerText.includes('grab')) {
                form.setFieldsValue({ category: 'Food' });
            } else if (lowerText.includes('transfer')) {
                form.setFieldsValue({ category: 'Other' });
            }

        } catch (error) {
            console.error(error);
            message.error('Failed to scan receipt');
        } finally {
            setScanning(false);
        }
        return false; // Prevent upload
    };

    return (
        <Modal
            title={initialValues ? "Edit Transaction" : "Add Transaction"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading || scanning}
        >
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <Upload beforeUpload={handleScan} showUploadList={false} accept="image/*">
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
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
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
                            <Select.Option value="Food">Food</Select.Option>
                            <Select.Option value="Transport">Transport</Select.Option>
                            <Select.Option value="Rent">Rent</Select.Option>
                            <Select.Option value="Salary">Salary</Select.Option>
                            <Select.Option value="Entertainment">Entertainment</Select.Option>
                            <Select.Option value="Utilities">Utilities</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
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
