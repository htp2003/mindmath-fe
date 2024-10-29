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
import { Button, Modal, Input, Select, Table, message } from "antd";

const ProblemTypeManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [problemTypes, setProblemTypes] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProblemType, setEditingProblemType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    numberOfInputs: 0,
  });

  // Fetch subjects from the API
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

  // Fetch chapters when the selected subject changes
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

  // Fetch topics when the selected chapter changes
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

  // Fetch problem types when the selected topic changes
  useEffect(() => {
    const fetchProblemTypes = async () => {
      if (selectedTopicId) {
        try {
          const data = await getProblemTypesByTopicId(selectedTopicId);
          setProblemTypes(data);
        } catch (error) {
          console.error("Error fetching problem types:", error);
          message.error("Failed to fetch problem types");
        }
      } else {
        setProblemTypes([]);
      }
    };
    fetchProblemTypes();
  }, [selectedTopicId]);

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

  const openEditModal = (problemType) => {
    setEditingProblemType(problemType);
    setFormData({
      name: problemType.name,
      description: problemType.description,
      numberOfInputs: problemType.numberOfInputs,
    });
    setIsModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "numberOfInputs" ? Number(value) : value,
    }));
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

      // Refresh problem types list
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

  const handleToggleProblemTypeStatus = async (problemType) => {
    try {
      await toggleProblemTypeStatus(selectedTopicId, problemType.id);
      message.success(
        `Problem type ${
          problemType.active ? "blocked" : "reactivated"
        } successfully!`
      );

      // Refresh problem types after status toggle
      const updatedProblemTypes = await getProblemTypesByTopicId(
        selectedTopicId
      );
      setProblemTypes(updatedProblemTypes);
    } catch (error) {
      console.error("Error toggling problem type status:", error);
      message.error("Failed to update problem type status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Problem Type Management</h1>

      <Select
        placeholder="Select Subject"
        style={{ width: "100%", marginBottom: 16 }}
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

      <Select
        placeholder="Select Chapter"
        style={{ width: "100%", marginBottom: 16 }}
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

      <Select
        placeholder="Select Topic"
        style={{ width: "100%", marginBottom: 16 }}
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

      <Button
        type="primary"
        onClick={() => {
          resetForm();
          setIsModalVisible(true);
        }}
        disabled={!selectedTopicId}
      >
        Add Problem Type
      </Button>

      <Modal
        title={
          editingProblemType ? "Edit Problem Type" : "Add New Problem Type"
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleModalClose}
      >
        <Input
          placeholder="Problem Type Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="mb-4"
        />
        <Input
          type="number"
          placeholder="Number of Inputs"
          value={formData.numberOfInputs}
          onChange={(e) => handleInputChange("numberOfInputs", e.target.value)}
          className="mb-4"
          min={0}
        />
      </Modal>

      <Table dataSource={problemTypes} rowKey="id" className="mt-4">
        <Table.Column title="Problem Type Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Number of Inputs"
          dataIndex="numberOfInputs"
          key="numberOfInputs"
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, problemType) => (
            <>
              <Button type="link" onClick={() => openEditModal(problemType)}>
                Edit
              </Button>
              <Button
                type="link"
                onClick={() => handleToggleProblemTypeStatus(problemType)}
                className={
                  problemType.active ? "text-green-500" : "text-red-500"
                }
              >
                {problemType.active ? "Active" : "Blocked"}
              </Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default ProblemTypeManagement;
