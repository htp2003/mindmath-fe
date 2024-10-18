import React, { useState, useEffect } from "react";
import {
  DesktopOutlined,
  UserOutlined,
  BookOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Layout, Menu, Button, theme } from "antd";
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
    <Link to="/admin/categories">Subject Management</Link>,
    "1",
    <DesktopOutlined />
  ),
  getItem(
    <Link to="/admin/users">User Management</Link>,
    "2",
    <UserOutlined />
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
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Check if token exists and extract user information
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser(decodedToken); // Save the decoded token user data
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login"); // Redirect to login page
  };

  const handleHome = () => {
    navigate("/"); // Navigate to homepage
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 16px", background: colorBgContainer, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Home Button */}
          <Button type="primary" onClick={handleHome}>
            Home
          </Button>

          {/* Admin Info (Avatar and Full Name) */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="large"
              style={{ backgroundColor: "#87d068", marginRight: "16px" }}
              icon={<UserOutlined />}
            />
            {/* Display the user's full name from the token */}
            <span>{user ? user.Fullname : "Loading..."}</span>
          </div>

          {/* Logout Button */}
          <Button type="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet /> {/* Render the selected component here */}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Phúc Design ©{new Date().getFullYear()} Created by Phuc0ngu
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
