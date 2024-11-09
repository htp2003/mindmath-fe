import React, { useEffect, useState } from "react";
import { getChaptersBySubjectId } from "../../services/chapterService";
import { getSubjects } from "../../services/subjectService";
import { getTopicsByChapterId } from "../../services/topicService";
import {
  getProblemTypesByTopicId,
  addProblemType,
  updateProblemType,
  toggleProblemTypeStatus,
} from "../../services/problemTypeService";
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

const ProblemTypeManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [problemTypes, setProblemTypes] = useState([]);
  const [filteredProblemTypes, setFilteredProblemTypes] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProblemType, setEditingProblemType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    numberOfInputs: 0,
  });

  // Existing fetch effects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        message.error("Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubjectId) {
        try {
          const data = await getChaptersBySubjectId(selectedSubjectId);
          setChapters(data);
        } catch (error) {
          console.error("Error fetching chapters:", error);
          message.error("Failed to fetch chapters");
        }
      } else {
        setChapters([]);
      }
    };
    fetchChapters();
  }, [selectedSubjectId]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedChapterId) {
        try {
          const data = await getTopicsByChapterId(selectedChapterId);
          setTopics(data);
        } catch (error) {
          console.error("Error fetching topics:", error);
          message.error("Failed to fetch topics");
        }
      } else {
        setTopics([]);
      }
    };
    fetchTopics();
  }, [selectedChapterId]);

  useEffect(() => {
    const fetchProblemTypes = async () => {
      if (selectedTopicId) {
        setLoading(true);
        try {
          const data = await getProblemTypesByTopicId(selectedTopicId);
          setProblemTypes(data);
        } catch (error) {
          console.error("Error fetching problem types:", error);
          message.error("Failed to fetch problem types");
        } finally {
          setLoading(false);
        }
      } else {
        setProblemTypes([]);
        setLoading(false);
      }
    };
    fetchProblemTypes();
  }, [selectedTopicId]);

  // Filter and sort effect
  useEffect(() => {
    let filtered = [...problemTypes];

    if (searchText) {
      filtered = filtered.filter(
        (type) =>
          type.name.toLowerCase().includes(searchText.toLowerCase()) ||
          type.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (type) =>
          (statusFilter === "active" && type.active) ||
          (statusFilter === "blocked" && !type.active)
      );
    }

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

    setFilteredProblemTypes(filtered);
  }, [problemTypes, searchText, sortOrder, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      numberOfInputs: 0,
    });
    setEditingProblemType(null);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      message.warning("Please fill all required fields");
      return;
    }

    try {
      if (editingProblemType) {
        await updateProblemType(
          selectedTopicId,
          editingProblemType.id,
          formData
        );
        message.success("Problem type updated successfully!");
      } else {
        await addProblemType(selectedTopicId, formData);
        message.success("Problem type added successfully!");
      }

      const updatedProblemTypes = await getProblemTypesByTopicId(
        selectedTopicId
      );
      setProblemTypes(updatedProblemTypes);
      handleModalClose();
    } catch (error) {
      console.error("Error saving problem type:", error);
      message.error(
        editingProblemType
          ? "Failed to update problem type"
          : "Failed to add problem type"
      );
    }
  };

  const confirmStatusToggle = (problemType) => {
    Modal.confirm({
      title: `Confirm ${
        problemType.active ? "Block" : "Activate"
      } Problem Type`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        problemType.active ? "block" : "activate"
      } ${problemType.name}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleToggleProblemTypeStatus(problemType),
    });
  };

  const handleToggleProblemTypeStatus = async (problemType) => {
    try {
      await toggleProblemTypeStatus(selectedTopicId, problemType.id);
      message.success(
        `Problem type ${
          problemType.active ? "blocked" : "reactivated"
        } successfully!`
      );
      const updatedProblemTypes = await getProblemTypesByTopicId(
        selectedTopicId
      );
      setProblemTypes(updatedProblemTypes);
    } catch (error) {
      console.error("Error toggling problem type status:", error);
      message.error("Failed to update problem type status");
    }
  };

  const getMoreMenu = (problemType) => [
    {
      key: "edit",
      label: "Edit Problem Type",
      icon: <EditOutlined />,
      onClick: () => {
        setEditingProblemType(problemType);
        setFormData({
          name: problemType.name,
          description: problemType.description,
          numberOfInputs: problemType.numberOfInputs,
        });
        setIsModalVisible(true);
      },
    },
    {
      key: "status",
      label: problemType.active
        ? "Block Problem Type"
        : "Activate Problem Type",
      icon: <FilterOutlined />,
      onClick: () => confirmStatusToggle(problemType),
    },
  ];

  const ProblemTypeCard = ({ problemType }) => (
    <Card
      hoverable
      className="problem-type-card"
      actions={[
        <Tooltip title="Edit Problem Type">
          <EditOutlined
            key="edit"
            onClick={() => {
              setEditingProblemType(problemType);
              setFormData({
                name: problemType.name,
                description: problemType.description,
                numberOfInputs: problemType.numberOfInputs,
              });
              setIsModalVisible(true);
            }}
          />
        </Tooltip>,
        <Tag
          color={problemType.active ? "success" : "error"}
          style={{ margin: "0 8px", cursor: "pointer" }}
          onClick={() => confirmStatusToggle(problemType)}
        >
          {problemType.active ? "Active" : "Blocked"}
        </Tag>,
        <Dropdown
          menu={{ items: getMoreMenu(problemType) }}
          placement="bottomRight"
        >
          <EllipsisOutlined key="more" />
        </Dropdown>,
      ]}
    >
      <Card.Meta
        title={problemType.name}
        description={
          <>
            <Paragraph ellipsis={{ rows: 2 }}>
              {problemType.description}
            </Paragraph>
            <Text type="secondary">Inputs: {problemType.numberOfInputs}</Text>
          </>
        }
      />
    </Card>
  );

  return (
    <div className="problem-type-management p-6">
      {/* Header Section */}
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={6}>
            <Title level={2} style={{ margin: 0 }}>
              Problem Type Management
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
                    setSelectedTopicId(null);
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
                  onChange={(value) => {
                    setSelectedChapterId(value);
                    setSelectedTopicId(null);
                  }}
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
              <Col xs={24} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Topic"
                  onChange={setSelectedTopicId}
                  value={selectedTopicId}
                  disabled={!selectedChapterId}
                >
                  {topics.map((topic) => (
                    <Select.Option key={topic.id} value={topic.id}>
                      {topic.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Search
                  placeholder="Search problem types..."
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
                    resetForm();
                    setIsModalVisible(true);
                  }}
                  style={{ width: "100%" }}
                  disabled={!selectedTopicId}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Problem Types Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading problem types...
        </div>
      ) : filteredProblemTypes.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredProblemTypes.map((problemType) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={problemType.id}>
              <ProblemTypeCard problemType={problemType} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <span>
              {selectedTopicId
                ? `No problem types found. ${
                    searchText && "Try different search terms."
                  }`
                : "Please select a subject, chapter, and topic to view problem types."}
            </span>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={
          editingProblemType ? "Edit Problem Type" : "Add New Problem Type"
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        okText={editingProblemType ? "Update" : "Add"}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Problem Type Name</Text>
            <Input
              placeholder="Enter problem type name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Text strong>Description</Text>
            <Input.TextArea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>
          <div>
            <Text strong>Number of Inputs</Text>
            <Input
              type="number"
              placeholder="Enter number of inputs"
              value={formData.numberOfInputs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfInputs: parseInt(e.target.value) || 0,
                })
              }
              min={0}
            />
          </div>
        </Space>
      </Modal>

      <style jsx>{`
        .problem-type-card {
          height: 100%;
          transition: all 0.3s;
        }
        .problem-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ProblemTypeManagement;
