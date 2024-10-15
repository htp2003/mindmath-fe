import React, { useEffect, useState } from "react";
import { getChaptersBySubjectId } from "../../services/chapterService"; // Assuming this service exists
import { getSubjects } from "../../services/subjectService"; // Assuming this service exists
import { getTopicsByChapterId} from "../../services/topicService"; // Assuming these services exist
import {
  getProblemTypesByTopicId,
  addProblemType,
} from "../../services/problemTypeService"; // Assuming you create these services
import { Button, Modal, Input, Select, Table, message } from "antd";

const ProblemTypeManagement = () => {
  const [subjects, setSubjects] = useState([]); // For subject selection
  const [chapters, setChapters] = useState([]); // For chapter selection
  const [topics, setTopics] = useState([]); // For topic selection
  const [problemTypes, setProblemTypes] = useState([]); // For displaying problem types
  const [newProblemType, setNewProblemType] = useState({
    name: "",
    description: "",
    topicId: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects(); // Fetch subjects
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch chapters from the API when the selected subject changes
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await getChaptersBySubjectId(selectedSubjectId); // Fetch chapters for the selected subject
        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (selectedSubjectId) {
      fetchChapters();
    }
  }, [selectedSubjectId]);

  // Fetch topics when the selected chapter changes
  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedChapterId) {
        try {
          const data = await getTopicsByChapterId(selectedChapterId); // Fetch topics for the selected chapter
          setTopics(data);
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      } else {
        setTopics([]); // Reset topics if no chapter is selected
      }
    };

    fetchTopics();
  }, [selectedChapterId]);

  // Fetch problem types when the selected topic changes
  useEffect(() => {
    const fetchProblemTypes = async () => {
      if (selectedTopicId) {
        try {
          const data = await getProblemTypesByTopicId(selectedTopicId); // Fetch problem types for the selected topic
          setProblemTypes(data);
        } catch (error) {
          console.error("Error fetching problem types:", error);
        }
      } else {
        setProblemTypes([]); // Reset problem types if no topic is selected
      }
    };

    fetchProblemTypes();
  }, [selectedTopicId]);

  const handleAddProblemType = async () => {
    if (
      newProblemType.name.trim() !== "" &&
      newProblemType.description.trim() !== "" &&
      newProblemType.topicId
    ) {
      try {
        await addProblemType(newProblemType.topicId, newProblemType); // Call addProblemType service
        setNewProblemType({ name: "", description: "", topicId: null }); // Reset form
        setIsModalVisible(false); // Close modal

        // Fetch updated problem types
        const updatedProblemTypes = await getProblemTypesByTopicId(
          newProblemType.topicId
        );
        setProblemTypes(updatedProblemTypes); // Update problem types state
        message.success("Problem Type added successfully!");
      } catch (error) {
        console.error("Error adding problem type:", error);
        message.error("Failed to add problem type");
      }
    } else {
      message.warning("Please fill all fields");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Problem Type Management</h1>

      {/* Subject selection */}
      <Select
        placeholder="Select Subject"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedSubjectId(value);
          setChapters([]); // Reset chapters when subject changes
          setTopics([]); // Reset topics when subject changes
          setProblemTypes([]); // Reset problem types when subject changes
          setSelectedChapterId(null); // Reset selected chapter when subject changes
          setSelectedTopicId(null); // Reset selected topic when subject changes
        }}
        value={selectedSubjectId} // Bind selected subject ID
      >
        {subjects.map((subject) => (
          <Select.Option key={subject.id} value={subject.id}>
            {subject.name}
          </Select.Option>
        ))}
      </Select>

      {/* Chapter selection */}
      <Select
        placeholder="Select Chapter"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedChapterId(value);
          setTopics([]); // Reset topics when chapter changes
          setProblemTypes([]); // Reset problem types when chapter changes
          setSelectedTopicId(null); // Reset selected topic when chapter changes
        }}
        value={selectedChapterId} // Bind selected chapter ID
        disabled={!selectedSubjectId} // Disable if no subject is selected
      >
        {chapters.map((chapter) => (
          <Select.Option key={chapter.id} value={chapter.id}>
            {chapter.name}
          </Select.Option>
        ))}
      </Select>

      {/* Topic selection */}
      <Select
        placeholder="Select Topic"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedTopicId(value);
          setNewProblemType({ ...newProblemType, topicId: value }); // Set topicId for the new problem type
        }}
        value={selectedTopicId} // Bind selected topic ID
        disabled={!selectedChapterId} // Disable if no chapter is selected
      >
        {topics.map((topic) => (
          <Select.Option key={topic.id} value={topic.id}>
            {topic.name}
          </Select.Option>
        ))}
      </Select>

      {/* Add Problem Type Button */}
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        disabled={!selectedTopicId} // Disable if no topic is selected
      >
        Add Problem Type
      </Button>

      {/* Modal for adding a new problem type */}
      <Modal
        title="Add New Problem Type"
        visible={isModalVisible}
        onOk={handleAddProblemType}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Problem Type Name"
          value={newProblemType.name}
          onChange={(e) =>
            setNewProblemType({ ...newProblemType, name: e.target.value })
          }
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={newProblemType.description}
          onChange={(e) =>
            setNewProblemType({
              ...newProblemType,
              description: e.target.value,
            })
          }
          className="mb-4"
        />
      </Modal>

      {/* Render the problem types table */}
      <h2 className="text-xl font-semibold mt-4">Problem Types</h2>
      <Table dataSource={problemTypes} rowKey="id">
        <Table.Column title="Problem Type Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
      </Table>
    </div>
  );
};

export default ProblemTypeManagement;
