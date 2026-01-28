import React from 'react';
import { Form, Input, InputNumber, Select, Modal } from 'antd';
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

    // Reset form when visible changes or initialValues changes
    React.useEffect(() => {
        if (visible) {
            form.resetFields();
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    // date: initialValues.date ? dayjs(initialValues.date) : dayjs(), // Handle date if needed
                });
            }
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title={initialValues ? "Edit Transaction" : "Add Transaction"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
        >
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
                {/* Date picker can be added here if needed */}
            </Form>
        </Modal>
    );
};

export default TransactionForm;
