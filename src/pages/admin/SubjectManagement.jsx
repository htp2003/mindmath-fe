import React, { useEffect, useState } from "react";
import {
  getSubjects,
  addSubject,
  updateSubject,
  toggleSubjectStatus,
} from "../../services/subjectService";
import {
  Button,
  Modal,
  Input,
  message,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Empty,
  Tooltip,
  Dropdown,
  Select,
  Input as AntInput,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EllipsisOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = AntInput;

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("name"); // name, status
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, blocked

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...subjects];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchText.toLowerCase()) ||
          subject.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (subject) =>
          (statusFilter === "active" && subject.active) ||
          (statusFilter === "blocked" && !subject.active)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "name":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "status":
          return b.active - a.active;
        default:
          return 0;
      }
    });

    setFilteredSubjects(filtered);
  }, [subjects, searchText, sortOrder, statusFilter]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      message.error("Failed to fetch subjects.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (newSubject.name.trim() && newSubject.description.trim()) {
      try {
        const addedSubject = await addSubject(newSubject);
        setSubjects([...subjects, addedSubject]);
        setNewSubject({ name: "", description: "" });
        setIsModalVisible(false);
        message.success("Subject added successfully!");
      } catch (error) {
        message.error("Failed to add subject.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleEditSubject = async () => {
    if (selectedSubject.name.trim() && selectedSubject.description.trim()) {
      try {
        await updateSubject(selectedSubject.id, selectedSubject);
        setSubjects(
          subjects.map((subject) =>
            subject.id === selectedSubject.id ? selectedSubject : subject
          )
        );
        setSelectedSubject(null);
        setIsModalVisible(false);
        message.success("Subject updated successfully!");
      } catch (error) {
        message.error("Failed to update subject.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleToggleSubjectStatus = async (subjectId) => {
    try {
      await toggleSubjectStatus(subjectId);
      setSubjects(
        subjects.map((subject) =>
          subject.id === subjectId
            ? { ...subject, active: !subject.active }
            : subject
        )
      );
      message.success("Subject status updated successfully!");
    } catch (error) {
      message.error("Failed to update subject status.");
    }
  };

  const confirmStatusToggle = (subject) => {
    Modal.confirm({
      title: `Confirm ${subject.active ? "Block" : "Activate"} Subject`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        subject.active ? "block" : "activate"
      } ${subject.name}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleToggleSubjectStatus(subject.id),
    });
  };

  const getMoreMenu = (subject) => [
    {
      key: "edit",
      label: "Edit Subject",
      icon: <EditOutlined />,
      onClick: () => {
        setSelectedSubject(subject);
        setIsEditMode(true);
        setIsModalVisible(true);
      },
    },
    {
      key: "status",
      label: subject.active ? "Block Subject" : "Activate Subject",
      icon: <FilterOutlined />,
      onClick: () => confirmStatusToggle(subject),
    },
  ];

  const SubjectCard = ({ subject }) => (
    <Card
      hoverable
      className="subject-card"
      actions={[
        <Tooltip title="Edit Subject">
          <EditOutlined
            key="edit"
            onClick={() => {
              setSelectedSubject(subject);
              setIsEditMode(true);
              setIsModalVisible(true);
            }}
          />
        </Tooltip>,
        <Tag
          color={subject.active ? "success" : "error"}
          style={{ margin: "0 8px", cursor: "pointer" }}
          onClick={() => confirmStatusToggle(subject)}
        >
          {subject.active ? "Active" : "Blocked"}
        </Tag>,
        <Dropdown
          menu={{ items: getMoreMenu(subject) }}
          placement="bottomRight"
        >
          <EllipsisOutlined key="more" />
        </Dropdown>,
      ]}
    >
      <Card.Meta
        title={subject.name}
        description={
          <Paragraph ellipsis={{ rows: 2 }}>{subject.description}</Paragraph>
        }
      />
    </Card>
  );

  return (
    <div className="subject-management p-6">
      {/* Header Section */}
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={6}>
            <Title level={2} style={{ margin: 0 }}>
              Subject Management
            </Title>
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[16, 16]} justify="end">
              <Col xs={24} md={8}>
                <Search
                  placeholder="Search subjects..."
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={12} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Sort by"
                  onChange={(value) => setSortOrder(value)}
                  value={sortOrder}
                >
                  <Select.Option value="name">Name (A-Z)</Select.Option>
                  <Select.Option value="nameDesc">Name (Z-A)</Select.Option>
                  <Select.Option value="status">Status</Select.Option>
                </Select>
              </Col>
              <Col xs={12} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Filter by status"
                  onChange={(value) => setStatusFilter(value)}
                  value={statusFilter}
                >
                  <Select.Option value="all">All Status</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="blocked">Blocked</Select.Option>
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsEditMode(false);
                    setIsModalVisible(true);
                  }}
                  style={{ width: "100%" }}
                >
                  Add Subject
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading subjects...
        </div>
      ) : filteredSubjects.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredSubjects.map((subject) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={subject.id}>
              <SubjectCard subject={subject} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <span>
              No subjects found. {searchText && "Try different search terms."}
            </span>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Subject" : "Add New Subject"}
        open={isModalVisible}
        onOk={isEditMode ? handleEditSubject : handleAddSubject}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedSubject(null);
          setNewSubject({ name: "", description: "" });
        }}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Subject Name</Text>
            <Input
              placeholder="Enter subject name"
              value={isEditMode ? selectedSubject?.name : newSubject.name}
              onChange={(e) =>
                isEditMode
                  ? setSelectedSubject({
                      ...selectedSubject,
                      name: e.target.value,
                    })
                  : setNewSubject({ ...newSubject, name: e.target.value })
              }
            />
          </div>
          <div>
            <Text strong>Description</Text>
            <Input.TextArea
              placeholder="Enter subject description"
              value={
                isEditMode
                  ? selectedSubject?.description
                  : newSubject.description
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedSubject({
                      ...selectedSubject,
                      description: e.target.value,
                    })
                  : setNewSubject({
                      ...newSubject,
                      description: e.target.value,
                    })
              }
              rows={4}
            />
          </div>
        </Space>
      </Modal>

      <style jsx>{`
        .subject-card {
          height: 100%;
          transition: all 0.3s;
        }
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SubjectManagement;
