import React, { useEffect, useState } from "react";
import { getSubjects } from "../../services/subjectService";
import {
  addChapter,
  getChaptersBySubjectId,
  updateChapter,
  toggleChapterStatus,
} from "../../services/chapterService";
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

const ChapterManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({
    name: "",
    description: "",
    subjectId: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
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
    // Apply filters and sorting
    let filtered = [...chapters];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (chapter) =>
          chapter.name.toLowerCase().includes(searchText.toLowerCase()) ||
          chapter.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (chapter) =>
          (statusFilter === "active" && chapter.active) ||
          (statusFilter === "blocked" && !chapter.active)
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

    setFilteredChapters(filtered);
  }, [chapters, searchText, sortOrder, statusFilter]);

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
      setLoading(true);
      const data = await getChaptersBySubjectId(selectedSubjectId);
      setChapters(data);
    } catch (error) {
      message.error("Failed to fetch chapters.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (newChapter.name.trim() && newChapter.description.trim()) {
      try {
        await addChapter(selectedSubjectId, newChapter);
        message.success("Chapter added successfully!");
        setNewChapter({
          name: "",
          description: "",
          subjectId: selectedSubjectId,
        });
        setIsModalVisible(false);
        fetchChapters();
      } catch (error) {
        message.error("Failed to add chapter.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleEditChapter = async () => {
    if (selectedChapter.name.trim() && selectedChapter.description.trim()) {
      try {
        await updateChapter(
          selectedSubjectId,
          selectedChapter.id,
          selectedChapter
        );
        message.success("Chapter updated successfully!");
        fetchChapters();
        setSelectedChapter(null);
        setIsModalVisible(false);
      } catch (error) {
        message.error("Failed to update chapter.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const confirmStatusToggle = (chapter) => {
    Modal.confirm({
      title: `Confirm ${chapter.active ? "Block" : "Activate"} Chapter`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        chapter.active ? "block" : "activate"
      } ${chapter.name}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleToggleChapterStatus(chapter),
    });
  };

  const handleToggleChapterStatus = async (chapter) => {
    try {
      await toggleChapterStatus(selectedSubjectId, chapter.id);
      message.success("Chapter status updated successfully!");
      fetchChapters();
    } catch (error) {
      message.error("Failed to update chapter status.");
    }
  };

  const getMoreMenu = (chapter) => [
    {
      key: "edit",
      label: "Edit Chapter",
      icon: <EditOutlined />,
      onClick: () => {
        setSelectedChapter(chapter);
        setIsEditMode(true);
        setIsModalVisible(true);
      },
    },
    {
      key: "status",
      label: chapter.active ? "Block Chapter" : "Activate Chapter",
      icon: <FilterOutlined />,
      onClick: () => confirmStatusToggle(chapter),
    },
  ];

  const ChapterCard = ({ chapter }) => (
    <Card
      hoverable
      className="chapter-card"
      actions={[
        <Tooltip title="Edit Chapter">
          <EditOutlined
            key="edit"
            onClick={() => {
              setSelectedChapter(chapter);
              setIsEditMode(true);
              setIsModalVisible(true);
            }}
          />
        </Tooltip>,
        <Tag
          color={chapter.active ? "success" : "error"}
          style={{ margin: "0 8px", cursor: "pointer" }}
          onClick={() => confirmStatusToggle(chapter)}
        >
          {chapter.active ? "Active" : "Blocked"}
        </Tag>,
        <Dropdown
          menu={{ items: getMoreMenu(chapter) }}
          placement="bottomRight"
        >
          <EllipsisOutlined key="more" />
        </Dropdown>,
      ]}
    >
      <Card.Meta
        title={chapter.name}
        description={
          <Paragraph ellipsis={{ rows: 2 }}>{chapter.description}</Paragraph>
        }
      />
    </Card>
  );

  return (
    <div className="chapter-management p-6">
      {/* Header Section */}
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={6}>
            <Title level={2} style={{ margin: 0 }}>
              Chapter Management
            </Title>
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[16, 16]} justify="end">
              <Col xs={24} md={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Subject"
                  onChange={(value) => {
                    setSelectedSubjectId(value);
                    setNewChapter({ ...newChapter, subjectId: value });
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
              <Col xs={24} md={4}>
                <Search
                  placeholder="Search chapters..."
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={12} md={4}>
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
              <Col xs={12} md={4}>
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
                  disabled={!selectedSubjectId}
                >
                  Add Chapter
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Chapters Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading chapters...
        </div>
      ) : filteredChapters.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredChapters.map((chapter) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={chapter.id}>
              <ChapterCard chapter={chapter} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <span>
              {selectedSubjectId
                ? `No chapters found. ${
                    searchText && "Try different search terms."
                  }`
                : "Please select a subject to view chapters."}
            </span>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Chapter" : "Add New Chapter"}
        open={isModalVisible}
        onOk={isEditMode ? handleEditChapter : handleAddChapter}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedChapter(null);
          setNewChapter({
            name: "",
            description: "",
            subjectId: selectedSubjectId,
          });
        }}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Chapter Name</Text>
            <Input
              placeholder="Enter chapter name"
              value={isEditMode ? selectedChapter?.name : newChapter.name}
              onChange={(e) =>
                isEditMode
                  ? setSelectedChapter({
                      ...selectedChapter,
                      name: e.target.value,
                    })
                  : setNewChapter({ ...newChapter, name: e.target.value })
              }
            />
          </div>
          <div>
            <Text strong>Description</Text>
            <Input.TextArea
              placeholder="Enter chapter description"
              value={
                isEditMode
                  ? selectedChapter?.description
                  : newChapter.description
              }
              onChange={(e) =>
                isEditMode
                  ? setSelectedChapter({
                      ...selectedChapter,
                      description: e.target.value,
                    })
                  : setNewChapter({
                      ...newChapter,
                      description: e.target.value,
                    })
              }
              rows={4}
            />
          </div>
        </Space>
      </Modal>

      <style jsx>{`
        .chapter-card {
          height: 100%;
          transition: all 0.3s;
        }
        .chapter-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ChapterManagement;
