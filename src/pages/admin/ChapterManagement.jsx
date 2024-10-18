import React, { useEffect, useState } from "react";
import { getSubjects } from "../../services/subjectService"; // Assuming this service exists
import {
  addChapter,
  getChaptersBySubjectId,
} from "../../services/chapterService"; // Assuming these services exist
import { Button, Modal, Input, Select, Table, message } from "antd"; // Import Ant Design components

const ChapterManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({
    name: "",
    description: "",
    subjectId: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        message.error("Failed to fetch subjects."); // Show error message
      }
    };

    fetchSubjects();
  }, []);

  // Fetch chapters when the selected subject changes
  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubjectId) {
        try {
          const data = await getChaptersBySubjectId(selectedSubjectId); // Fetch chapters for the selected subject
          setChapters(data);
        } catch (error) {
          console.error("Error fetching chapters:", error);
          message.error("Failed to fetch chapters."); // Show error message
        }
      }
    };

    fetchChapters();
  }, [selectedSubjectId]);

  const handleAddChapter = async () => {
    if (
      newChapter.name.trim() !== "" &&
      newChapter.description.trim() !== "" &&
      newChapter.subjectId
    ) {
      try {
        await addChapter(newChapter.subjectId, newChapter); // Call addChapter service
        message.success("Chapter added successfully!"); // Show success message

        setNewChapter({ name: "", description: "", subjectId: null }); // Reset form
        setIsModalVisible(false); // Close modal

        // Fetch updated chapters
        const updatedChapters = await getChaptersBySubjectId(
          newChapter.subjectId
        );
        setChapters(updatedChapters); // Update chapters state
      } catch (error) {
        console.error("Error adding chapter:", error);
        message.error("Failed to add chapter."); // Show error message
      }
    } else {
      message.warning("Please fill in all fields."); // Show warning if fields are empty
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chapter Management</h1>
      <Select
        placeholder="Select Subject"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedSubjectId(value);
          setNewChapter({ ...newChapter, subjectId: value }); // Set subjectId for the new chapter
        }}
      >
        {subjects.map((subject) => (
          <Select.Option key={subject.id} value={subject.id}>
            {subject.name}
          </Select.Option>
        ))}
      </Select>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Chapter
      </Button>
      <Modal
        title="Add New Chapter"
        visible={isModalVisible}
        onOk={handleAddChapter}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Chapter Name"
          value={newChapter.name}
          onChange={(e) =>
            setNewChapter({ ...newChapter, name: e.target.value })
          }
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={newChapter.description}
          onChange={(e) =>
            setNewChapter({ ...newChapter, description: e.target.value })
          }
          className="mb-4"
        />
      </Modal>

      {/* Render the chapters table here */}
      <h2 className="text-xl font-semibold mt-4">Chapters</h2>
      <Table dataSource={chapters} rowKey="id">
        <Table.Column title="Chapter Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
      </Table>
    </div>
  );
};

export default ChapterManagement;
