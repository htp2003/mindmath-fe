import React, { useState, useEffect } from "react";
import {
  DesktopOutlined,
  UserOutlined,
  BookOutlined,
  ReadOutlined,
  SolutionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Layout,
  Menu,
  Button,
  theme,
  Drawer,
  Space,
} from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

const items = [
  getItem(
    <Link to="/admin/users">User Management</Link>,
    "1",
    <UserOutlined />
  ),
  getItem(
    <Link to="/admin/subjects">Subject Management</Link>,
    "2",
    <DesktopOutlined />
  ),

  getItem(
    <Link to="/admin/chapters">Chapter Management</Link>,
    "3",
    <BookOutlined />
  ),
  getItem(
    <Link to="/admin/topics">Topic Management</Link>,
    "4",
    <ReadOutlined />
  ),
  getItem(
    <Link to="/admin/problem-types">Problem Type Management</Link>,
    "5",
    <SolutionOutlined />
  ),
];

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDrawerVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const renderSideMenu = () => (
    <Menu
      theme="dark"
      defaultSelectedKeys={["1"]}
      mode="inline"
      items={items}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="demo-logo-vertical" />
          {renderSideMenu()}
        </Sider>
      )}

      <Layout style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            {isMobile && (
              <Button
                type="text"
                icon={
                  drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={toggleDrawer}
              />
            )}
            <Button type="primary" onClick={handleHome}>
              Home
            </Button>
          </Space>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <Avatar
              size={isMobile ? "default" : "large"}
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
            <span
              style={{
                display: isMobile ? "none" : "inline",
                marginRight: "16px",
              }}
            >
              {user ? user.Fullname : "Loading..."}
            </span>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>

        {isMobile && (
          <Drawer
            title="Menu"
            placement="left"
            onClose={toggleDrawer}
            visible={drawerVisible}
            bodyStyle={{ padding: 0 }}
          >
            {renderSideMenu()}
          </Drawer>
        )}

        <Content style={{ margin: isMobile ? "8px" : "16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: isMobile ? 16 : 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            padding: isMobile ? "12px" : "24px",
          }}
        >
          Phúc Design ©{new Date().getFullYear()} Created by Phuc0ngu
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
