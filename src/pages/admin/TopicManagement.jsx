import React, { useEffect, useState } from "react";
import { getChaptersBySubjectId } from "../../services/chapterService";
import { getSubjects } from "../../services/subjectService";
import {
  getTopicsByChapterId,
  addTopic,
  updateTopic,
  toggleTopicStatus,
} from "../../services/topicService";
import { Button, Modal, Input, Select, Table, message } from "antd";

const TopicManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        message.error("Failed to fetch subjects.");
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
          message.error("Failed to fetch chapters.");
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
          message.error("Failed to fetch topics.");
        }
      } else {
        setTopics([]);
      }
    };

    fetchTopics();
  }, [selectedChapterId]);

  const handleAddTopic = async () => {
    if (
      newTopic.name.trim() &&
      newTopic.description.trim() &&
      newTopic.chapterId
    ) {
      try {
        await addTopic(newTopic.chapterId, newTopic);
        message.success("Topic added successfully!");

        setNewTopic({
          name: "",
          description: "",
          chapterId: selectedChapterId,
        });
        setIsModalVisible(false);

        const updatedTopics = await getTopicsByChapterId(newTopic.chapterId);
        setTopics(updatedTopics);
      } catch (error) {
        console.error("Error adding topic:", error);
        message.error("Failed to add topic.");
      }
    } else {
      message.warning("Please fill all fields.");
    }
  };

  const handleEditTopic = async () => {
    if (selectedTopic) {
      const updatedTopicData = {
        name: newTopic.name,
        description: newTopic.description,
      };
      try {
        await updateTopic(
          selectedChapterId,
          selectedTopic.id,
          updatedTopicData
        );
        message.success("Topic updated successfully!");

        const updatedTopics = await getTopicsByChapterId(selectedChapterId);
        setTopics(updatedTopics);

        setSelectedTopic(null);
        setIsEditMode(false);
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error updating topic:", error);
        message.error("Failed to update topic.");
      }
    }
  };

 const handleToggleTopicStatus = async (topic) => {
   try {
     await toggleTopicStatus(selectedChapterId, topic.id); // Pass chapterId and topicId
     message.success(
       topic.active
         ? "Topic blocked successfully!"
         : "Topic reactivated successfully!"
     );

     // Refresh topics after status toggle
     const updatedTopics = await getTopicsByChapterId(selectedChapterId);
     setTopics(updatedTopics);
   } catch (error) {
     console.error("Error toggling topic status:", error);
     message.error("Failed to update topic status.");
   }
 };


  const openEditModal = (topic) => {
    setSelectedTopic(topic);
    setNewTopic({
      name: topic.name,
      description: topic.description,
      chapterId: selectedChapterId,
    });
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedTopic(null);
    setNewTopic({ name: "", description: "", chapterId: selectedChapterId });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Topic Management</h1>

      <Select
        placeholder="Select Subject"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedSubjectId(value);
          setChapters([]);
          setTopics([]);
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

      <Select
        placeholder="Select Chapter"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedChapterId(value);
          setNewTopic({ ...newTopic, chapterId: value });
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

      <Button
        type="primary"
        onClick={() => {
          setIsModalVisible(true);
          setIsEditMode(false);
          setNewTopic({
            name: "",
            description: "",
            chapterId: selectedChapterId,
          });
        }}
        disabled={!selectedChapterId}
      >
        Add Topic
      </Button>

      <Modal
        title={isEditMode ? "Edit Topic" : "Add New Topic"}
        visible={isModalVisible}
        onOk={isEditMode ? handleEditTopic : handleAddTopic}
        onCancel={handleModalClose}
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

      <h2 className="text-xl font-semibold mt-4">Topics</h2>
      <Table dataSource={topics} rowKey="id">
        <Table.Column title="Topic Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, topic) => (
            <>
              <Button type="link" onClick={() => openEditModal(topic)}>
                Edit
              </Button>
              <Button
                type="link"
                onClick={() => handleToggleTopicStatus(topic)}
                className={topic.active ? "text-green-500" : "text-red-500"}
              >
                {topic.active ? "Active" : "Blocked"}
              </Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default TopicManagement;
