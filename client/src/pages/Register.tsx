import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const { Title } = Typography;

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const userData = await authService.register(values);
            setUser(userData);
            message.success('Registration successful');
            navigate('/');
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = (error as any).response?.data?.message || 'Registration failed';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background orbs */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                top: '-100px',
                left: '-100px',
                animation: 'float 7s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                bottom: '-80px',
                right: '-80px',
                animation: 'float 5s ease-in-out infinite reverse'
            }} />

            <Card style={{
                width: '100%',
                maxWidth: 420,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                animation: 'scaleIn 0.5s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        animation: 'float 3s ease-in-out infinite'
                    }}>✨</div>
                    <Title level={2} style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 8
                    }}>Expense Tracker</Title>
                    <Title level={4} style={{ color: 'rgba(255,255,255,0.7)', marginTop: 0 }}>สมัครสมาชิก</Title>
                </div>
                <Form
                    name="register_form"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ใช้" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'กรุณากรอกอีเมล!' }, { type: 'email', message: 'อีเมลไม่ถูกต้อง' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="อีเมล" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{
                            width: '100%',
                            height: '48px',
                            fontSize: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px'
                        }} loading={loading}>
                            สมัครสมาชิก
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: '#667eea' }}>เข้าสู่ระบบ</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
