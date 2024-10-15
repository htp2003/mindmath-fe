import React, { useState } from "react";
import {
  DesktopOutlined,
  UserOutlined,
  BookOutlined,
  ReadOutlined,
  SolutionOutlined, // Import SolutionOutlined for Problem Type Management
} from "@ant-design/icons"; // Import icons for menu items
import { Avatar, Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom"; // Make sure to include Outlet

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

// Updated items array to include Topic Management and Problem Type Management
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
    <Link to="/admin/topics">Topic Management</Link>, // New Topic Management Item
    "4",
    <ReadOutlined /> // Icon for Topic Management
  ),
  getItem(
    <Link to="/admin/problem-types">Problem Type Management</Link>, // New Problem Type Management Item
    "5",
    <SolutionOutlined /> // Icon for Problem Type Management
  ),
];

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {/* Header content can go here */}
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
