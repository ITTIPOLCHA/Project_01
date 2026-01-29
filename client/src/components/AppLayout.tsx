import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, theme, Drawer, Grid } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UnorderedListOutlined,
    LogoutOutlined,
    CalendarOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.md; // < 768px
    
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

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => {
                navigate('/');
                if (isMobile) setDrawerVisible(false);
            },
        },
        {
            key: '/transactions',
            icon: <UnorderedListOutlined />,
            label: 'Transactions',
            onClick: () => {
                navigate('/transactions');
                if (isMobile) setDrawerVisible(false);
            },
        },
        {
            key: '/calendar',
            icon: <CalendarOutlined />,
            label: 'Calendar',
            onClick: () => {
                navigate('/calendar');
                if (isMobile) setDrawerVisible(false);
            },
        },
    ];

    const sideMenu = (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
        />
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                    {sideMenu}
                </Sider>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    placement="left"
                    closable={true}
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    styles={{ body: { padding: 0, background: '#001529' } }}
                    width={250}
                >
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                    {sideMenu}
                </Drawer>
            )}

            <Layout>
                <Header style={{ 
                    padding: '0 16px', 
                    background: colorBgContainer, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    {isMobile ? (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setDrawerVisible(true)}
                            style={{ fontSize: '16px' }}
                        />
                    ) : (
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
                    )}
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        {!isMobile && 'Logout'}
                    </Button>
                </Header>
                <Content
                    style={{
                        margin: isMobile ? '16px 8px' : '24px 16px',
                        padding: isMobile ? 16 : 24,
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
