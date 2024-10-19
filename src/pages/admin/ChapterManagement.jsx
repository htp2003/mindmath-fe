import React, { useEffect, useState } from "react";
import { getSubjects } from "../../services/subjectService";
import {
  addChapter,
  getChaptersBySubjectId,
  updateChapter,
  deactivateChapter,
} from "../../services/chapterService";
import { Button, Modal, Input, Select, Table, message } from "antd";

const ChapterManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({
    name: "",
    description: "",
    subjectId: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null); // For editing
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        message.error("Failed to fetch subjects.");
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
          message.error("Failed to fetch chapters.");
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
        await addChapter(newChapter.subjectId, newChapter);
        message.success("Chapter added successfully!");
        setNewChapter({ name: "", description: "", subjectId: null });
        setIsModalVisible(false);

        // Fetch updated chapters
        const updatedChapters = await getChaptersBySubjectId(
          newChapter.subjectId
        );
        setChapters(updatedChapters);
      } catch (error) {
        message.error("Failed to add chapter.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleEditChapter = async () => {
    if (
      selectedChapter.name.trim() !== "" &&
      selectedChapter.description.trim() !== ""
    ) {
      try {
        await updateChapter(
          selectedSubjectId,
          selectedChapter.id,
          selectedChapter
        );
        setChapters(
          chapters.map((chapter) =>
            chapter.id === selectedChapter.id ? selectedChapter : chapter
          )
        );
        message.success("Chapter updated successfully!");
        setSelectedChapter(null);
        setIsModalVisible(false);
      } catch (error) {
        message.error("Failed to update chapter.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleDeactivateChapter = async (chapterId) => {
    try {
      await deactivateChapter(selectedSubjectId, chapterId);
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
      message.success("Chapter deactivated successfully!");
    } catch (error) {
      message.error("Failed to deactivate chapter.");
    }
  };

  const openEditModal = (chapter) => {
    setSelectedChapter(chapter);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chapter Management</h1>
      <Select
        placeholder="Select Subject"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(value) => {
          setSelectedSubjectId(value);
          setNewChapter({ ...newChapter, subjectId: value });
        }}
      >
        {subjects.map((subject) => (
          <Select.Option key={subject.id} value={subject.id}>
            {subject.name}
          </Select.Option>
        ))}
      </Select>

      <Button
        type="primary"
        onClick={() => {
          setIsEditMode(false);
          setIsModalVisible(true);
        }}
      >
        Add Chapter
      </Button>

      <Modal
        title={isEditMode ? "Edit Chapter" : "Add New Chapter"}
        visible={isModalVisible}
        onOk={isEditMode ? handleEditChapter : handleAddChapter}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Chapter Name"
          value={isEditMode ? selectedChapter?.name : newChapter.name}
          onChange={(e) =>
            isEditMode
              ? setSelectedChapter({ ...selectedChapter, name: e.target.value })
              : setNewChapter({ ...newChapter, name: e.target.value })
          }
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={
            isEditMode ? selectedChapter?.description : newChapter.description
          }
          onChange={(e) =>
            isEditMode
              ? setSelectedChapter({
                  ...selectedChapter,
                  description: e.target.value,
                })
              : setNewChapter({ ...newChapter, description: e.target.value })
          }
          className="mb-4"
        />
      </Modal>

      <h2 className="text-xl font-semibold mt-4">Chapters</h2>
      <Table dataSource={chapters} rowKey="id">
        <Table.Column title="Chapter Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, chapter) => (
            <>
              <Button type="link" onClick={() => openEditModal(chapter)}>
                Edit
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleDeactivateChapter(chapter.id)}
              >
                {chapter.active ? "Deactivate" : "Deactivated"}
              </Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default ChapterManagement;
