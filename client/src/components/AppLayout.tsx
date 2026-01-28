import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UnorderedListOutlined,
    LogoutOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useContext(AuthContext);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={[
                        {
                            key: '/',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                            onClick: () => navigate('/'),
                        },
                        {
                            key: '/transactions',
                            icon: <UnorderedListOutlined />,
                            label: 'Transactions',
                            onClick: () => navigate('/transactions'),
                        },
                        {
                            key: '/calendar',
                            icon: <CalendarOutlined />,
                            label: 'Calendar',
                            onClick: () => navigate('/calendar'),
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ marginRight: 16 }}
                    >
                        Logout
                    </Button>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
