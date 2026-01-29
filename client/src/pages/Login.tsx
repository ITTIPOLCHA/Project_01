import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const { Title } = Typography;

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const userData = await authService.login(values);
            setUser(userData);
            message.success('Login successful');
            navigate('/');
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = (error as any).response?.data?.message || 'Login failed';
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
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                top: '-100px',
                right: '-100px',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                bottom: '-50px',
                left: '-50px',
                animation: 'float 8s ease-in-out infinite reverse'
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
                    }}>💰</div>
                    <Title level={2} style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 8
                    }}>Expense Tracker</Title>
                    <Title level={4} style={{ color: 'rgba(255,255,255,0.7)', marginTop: 0 }}>เข้าสู่ระบบ</Title>
                </div>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'กรุณากรอกอีเมล!' }, { type: 'email', message: 'อีเมลไม่ถูกต้อง' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="อีเมล"
                            size="large"
                            autoComplete="username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="รหัสผ่าน"
                            size="large"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 12 }}>
                        <Checkbox style={{ color: 'rgba(255,255,255,0.7)' }}>จดจำฉันไว้</Checkbox>
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
                            เข้าสู่ระบบ
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        ยังไม่มีบัญชี? <Link to="/register" style={{ color: '#667eea' }}>สมัครสมาชิก</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
