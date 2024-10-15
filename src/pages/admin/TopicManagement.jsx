import React, { useEffect, useState } from "react";
import { getChaptersBySubjectId } from "../../services/chapterService"; // Assuming this service exists
import { getSubjects } from "../../services/subjectService"; // Assuming you create this service
import { getTopicsByChapterId, addTopic } from "../../services/topicService"; // Assuming you create these services
import { Button, Modal, Input, Select, Table, message } from "antd";

const TopicManagement = () => {
  const [subjects, setSubjects] = useState([]); // For subject selection
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    chapterId: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);

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

  const handleAddTopic = async () => {
    if (
      newTopic.name.trim() !== "" &&
      newTopic.description.trim() !== "" &&
      newTopic.chapterId
    ) {
      try {
        await addTopic(newTopic.chapterId, newTopic); // Call addTopic service
        setNewTopic({ name: "", description: "", chapterId: null }); // Reset form
        setIsModalVisible(false); // Close modal

        // Fetch updated topics
        const updatedTopics = await getTopicsByChapterId(newTopic.chapterId);
        setTopics(updatedTopics); // Update topics state
        message.success("Topic added successfully!");
      } catch (error) {
        console.error("Error adding topic:", error);
        message.error("Failed to add topic");
      }
    } else {
      message.warning("Please fill all fields");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Topic Management</h1>

      {/* Subject selection */}
      <Select
        placeholder="Select Subject"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedSubjectId(value);
          setChapters([]); // Reset chapters when subject changes
          setTopics([]); // Reset topics when subject changes
          setSelectedChapterId(null); // Reset selected chapter when subject changes
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
          setNewTopic({ ...newTopic, chapterId: value }); // Set chapterId for the new topic
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

      {/* Add Topic Button */}
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        disabled={!selectedChapterId}
      >
        Add Topic
      </Button>

      {/* Modal for adding a new topic */}
      <Modal
        title="Add New Topic"
        visible={isModalVisible}
        onOk={handleAddTopic}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Topic Name"
          value={newTopic.name}
          onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={newTopic.description}
          onChange={(e) =>
            setNewTopic({ ...newTopic, description: e.target.value })
          }
          className="mb-4"
        />
      </Modal>

      {/* Render the topics table */}
      <h2 className="text-xl font-semibold mt-4">Topics</h2>
      <Table dataSource={topics} rowKey="id">
        <Table.Column title="Topic Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
      </Table>
    </div>
  );
};

export default TopicManagement;
