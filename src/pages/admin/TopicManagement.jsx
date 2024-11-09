import React, { useEffect, useState } from "react";
import { getChaptersBySubjectId } from "../../services/chapterService";
import { getSubjects } from "../../services/subjectService";
import {
  getTopicsByChapterId,
  addTopic,
  updateTopic,
  toggleTopicStatus,
} from "../../services/topicService";
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
  ExclamationCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = AntInput;

const TopicManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    chapterId: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      fetchChapters();
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (selectedChapterId) {
      fetchTopics();
    }
  }, [selectedChapterId]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...topics];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (topic) =>
          topic.name.toLowerCase().includes(searchText.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (topic) =>
          (statusFilter === "active" && topic.active) ||
          (statusFilter === "blocked" && !topic.active)
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

    setFilteredTopics(filtered);
  }, [topics, searchText, sortOrder, statusFilter]);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      message.error("Failed to fetch subjects.");
    }
  };

  const fetchChapters = async () => {
    try {
      const data = await getChaptersBySubjectId(selectedSubjectId);
      setChapters(data);
      setSelectedChapterId(null);
    } catch (error) {
      message.error("Failed to fetch chapters.");
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await getTopicsByChapterId(selectedChapterId);
      setTopics(data);
    } catch (error) {
      message.error("Failed to fetch topics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (newTopic.name.trim() && newTopic.description.trim()) {
      try {
        await addTopic(selectedChapterId, newTopic);
        message.success("Topic added successfully!");
        setNewTopic({
          name: "",
          description: "",
          chapterId: selectedChapterId,
        });
        setIsModalVisible(false);
        fetchTopics();
      } catch (error) {
        message.error("Failed to add topic.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleEditTopic = async () => {
    if (selectedTopic.name.trim() && selectedTopic.description.trim()) {
      try {
        await updateTopic(selectedChapterId, selectedTopic.id, selectedTopic);
        message.success("Topic updated successfully!");
        fetchTopics();
        setSelectedTopic(null);
        setIsModalVisible(false);
      } catch (error) {
        message.error("Failed to update topic.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const confirmStatusToggle = (topic) => {
    Modal.confirm({
      title: `Confirm ${topic.active ? "Block" : "Activate"} Topic`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        topic.active ? "block" : "activate"
      } ${topic.name}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleToggleTopicStatus(topic),
    });
  };

  const handleToggleTopicStatus = async (topic) => {
    try {
      await toggleTopicStatus(selectedChapterId, topic.id);
      message.success("Topic status updated successfully!");
      fetchTopics();
    } catch (error) {
      message.error("Failed to update topic status.");
    }
  };

  const getMoreMenu = (topic) => [
    {
      key: "edit",
      label: "Edit Topic",
      icon: <EditOutlined />,
      onClick: () => {
        setSelectedTopic(topic);
        setIsEditMode(true);
        setIsModalVisible(true);
      },
    },
    {
      key: "status",
      label: topic.active ? "Block Topic" : "Activate Topic",
      icon: <FilterOutlined />,
      onClick: () => confirmStatusToggle(topic),
    },
  ];

  const TopicCard = ({ topic }) => (
    <Card
      hoverable
      className="topic-card"
      actions={[
        <Tooltip title="Edit Topic">
          <EditOutlined
            key="edit"
            onClick={() => {
              setSelectedTopic(topic);
              setIsEditMode(true);
              setIsModalVisible(true);
            }}
          />
        </Tooltip>,
        <Tag
          color={topic.active ? "success" : "error"}
          style={{ margin: "0 8px", cursor: "pointer" }}
          onClick={() => confirmStatusToggle(topic)}
        >
          {topic.active ? "Active" : "Blocked"}
        </Tag>,
        <Dropdown menu={{ items: getMoreMenu(topic) }} placement="bottomRight">
          <EllipsisOutlined key="more" />
        </Dropdown>,
      ]}
    >
      <Card.Meta
        title={topic.name}
        description={
          <Paragraph ellipsis={{ rows: 2 }}>{topic.description}</Paragraph>
        }
      />
    </Card>
  );

  return (
    <div className="topic-management p-6">
      {/* Header Section */}
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={6}>
            <Title level={2} style={{ margin: 0 }}>
              Topic Management
            </Title>
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[16, 16]} justify="end">
              <Col xs={24} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Subject"
                  onChange={(value) => {
                    setSelectedSubjectId(value);
                    setSelectedChapterId(null);
                  }}
                  value={selectedSubjectId}
                >
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Chapter"
                  onChange={(value) => setSelectedChapterId(value)}
                  value={selectedChapterId}
                  disabled={!selectedSubjectId}
                >
                  {chapters.map((chapter) => (
                    <Select.Option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Search
                  placeholder="Search topics..."
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={12} md={3}>
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
              <Col xs={12} md={3}>
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
              <Col xs={24} md={2}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsEditMode(false);
                    setIsModalVisible(true);
                  }}
                  style={{ width: "100%" }}
                  disabled={!selectedChapterId}
                >
                  Add Topic
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading topics...
        </div>
      ) : filteredTopics.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredTopics.map((topic) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={topic.id}>
              <TopicCard topic={topic} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <span>
              {selectedChapterId
                ? `No topics found. ${
                    searchText && "Try different search terms."
                  }`
                : "Please select a subject and chapter to view topics."}
            </span>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Topic" : "Add New Topic"}
        open={isModalVisible}
        onOk={isEditMode ? handleEditTopic : handleAddTopic}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedTopic(null);
          setNewTopic({
            name: "",
            description: "",
            chapterId: selectedChapterId,
          });
        }}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Topic Name</Text>
            <Input
              placeholder="Enter topic name"
              value={isEditMode ? selectedTopic?.name : newTopic.name}
              onChange={(e) =>
                isEditMode
                  ? setSelectedTopic({
                      ...selectedTopic,
                      name: e.target.value,
                    })
                  : setNewTopic({ ...newTopic, name: e.target.value })
              }
            />
          </div>
          <div>
            <Text strong>Description</Text>
            <Input.TextArea
              placeholder="Enter topic description"
              value={
                isEditMode ? selectedTopic?.description : newTopic.description
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedTopic({
                      ...selectedTopic,
                      description: e.target.value,
                    })
                  : setNewTopic({
                      ...newTopic,
                      description: e.target.value,
                    })
              }
              rows={4}
            />
          </div>
        </Space>
      </Modal>

      <style jsx>{`
        .topic-card {
          height: 100%;
          transition: all 0.3s;
        }
        .topic-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default TopicManagement;
