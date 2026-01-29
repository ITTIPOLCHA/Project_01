import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Modal, Upload, Button, message, Spin } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import Tesseract from 'tesseract.js';
import type { ITransaction } from '../types';

interface TransactionFormProps {
    visible: boolean;
    onCancel: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinish: (values: any) => Promise<void>;
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
            const result = await Tesseract.recognize(file, 'tha+eng');
            const text = result.data.text;
            console.log('OCR Text:', text);

            // Extract amount (e.g., 100.00, 1,200.50)
            const amountMatch = text.match(/[\d,]+\.\d{2}/);
            let amount = 0;
            if (amountMatch) {
                amount = parseFloat(amountMatch[0].replace(/,/g, ''));
            }

            // Extract recipient name (Thai name pattern - คนที่โอนไปให้)
            // Look for patterns like "ไปยัง", "โอนไป", "ผู้รับ", or Thai name patterns
            let recipientName = '';

            // Pattern 1: After "ไปยัง" or "โอนไป" or "ผู้รับ"
            const recipientPatterns = [
                /(?:ไปยัง|โอนไป|ผู้รับ|to|To|TO)[:\s]*([ก-๙a-zA-Z\s]+)/,
                /(?:นาย|นาง|นางสาว|Mr\.|Mrs\.|Ms\.)[ก-๙a-zA-Z\s]+/,
            ];

            for (const pattern of recipientPatterns) {
                const match = text.match(pattern);
                if (match) {
                    recipientName = match[1] || match[0];
                    recipientName = recipientName.trim().substring(0, 50); // Limit length
                    break;
                }
            }

            // If no recipient found, try to get any Thai name-like pattern
            if (!recipientName) {
                const thaiNameMatch = text.match(/[ก-๙]{2,}\s+[ก-๙]{2,}/);
                if (thaiNameMatch) {
                    recipientName = thaiNameMatch[0].trim();
                }
            }

            if (amount <= 0) {
                message.warning('ไม่สามารถอ่านจำนวนเงินจากสลิปได้');
                setScanning(false);
                return false;
            }

            // Create transaction data and submit directly
            const transactionData = {
                type: 'expense',
                amount: amount,
                category: 'สลิป',
                description: recipientName || 'สลิปโอนเงิน',
            };

            message.success(`บันทึกสลิป: ${amount} บาท - ${recipientName || 'สลิปโอนเงิน'}`);

            // Stop scanning BEFORE submitting to prevent UI lock
            setScanning(false);

            // Close modal and submit
            await onFinish(transactionData);

        } catch (error) {
            console.error(error);
            message.error('ไม่สามารถอ่านสลิปได้');
            setScanning(false); // Ensure scanning is false on error
        }
        return false; // Prevent upload
    };

    return (
        <Modal
            title={initialValues ? "Edit Transaction" : "Add Transaction"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading} /* Only use loading (server), not scanning */
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
                            <Select.Option value="สลิป">สลิป</Select.Option>
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
