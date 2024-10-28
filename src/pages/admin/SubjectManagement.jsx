import React, { useEffect, useState } from "react";
import {
  getSubjects,
  addSubject,
  updateSubject,
  toggleSubjectStatus, // Import the toggle function
} from "../../services/subjectService"; // Updated service functions
import { Button, Modal, Input, message, Table } from "antd";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Fetch subjects from the API
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

  const handleAddSubject = async () => {
    if (newSubject.name.trim() !== "" && newSubject.description.trim() !== "") {
      try {
        const addedSubject = await addSubject(newSubject);
        setSubjects([...subjects, addedSubject]);
        setNewSubject({ name: "", description: "" });
        setIsModalVisible(false);
        message.success("Subject added successfully!");
      } catch (error) {
        console.error("Error adding subject:", error);
        message.error("Failed to add subject.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleEditSubject = async () => {
    if (
      selectedSubject.name.trim() !== "" &&
      selectedSubject.description.trim() !== ""
    ) {
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
        console.error("Error updating subject:", error);
        message.error("Failed to update subject.");
      }
    } else {
      message.warning("Please fill in all fields.");
    }
  };

  const handleToggleSubjectStatus = async (subjectId) => {
    try {
      await toggleSubjectStatus(subjectId); // Call API to block the subject
      setSubjects(
        subjects.map((subject) =>
          subject.id === subjectId
            ? { ...subject, active: false } // Set active to false in UI
            : subject
        )
      );
      message.success("Subject blocked successfully!");
    } catch (error) {
      console.error("Error blocking subject:", error);
      message.error("Failed to block subject.");
    }
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>
      <Button
        type="primary"
        onClick={() => {
          setIsEditMode(false);
          setIsModalVisible(true);
        }}
      >
        Add Subject
      </Button>

      <Modal
        title={isEditMode ? "Edit Subject" : "Add New Subject"}
        visible={isModalVisible}
        onOk={isEditMode ? handleEditSubject : handleAddSubject}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Subject Name"
          value={isEditMode ? selectedSubject?.name : newSubject.name}
          onChange={(e) =>
            isEditMode
              ? setSelectedSubject({ ...selectedSubject, name: e.target.value })
              : setNewSubject({ ...newSubject, name: e.target.value })
          }
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={
            isEditMode ? selectedSubject?.description : newSubject.description
          }
          onChange={(e) =>
            isEditMode
              ? setSelectedSubject({
                  ...selectedSubject,
                  description: e.target.value,
                })
              : setNewSubject({ ...newSubject, description: e.target.value })
          }
          className="mb-4"
        />
      </Modal>

      <Table dataSource={subjects} rowKey="id">
        <Table.Column title="Subject Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, subject) => (
            <span>
              <Button type="link" onClick={() => openEditModal(subject)}>
                Edit
              </Button>
              <button
                className={`${
                  subject.active ? "text-green-500" : "text-red-500"
                }`}
                onClick={() => handleToggleSubjectStatus(subject.id)} // Call toggle function
              >
                {subject.active ? "Active" : "Blocked"}{" "}
                {/* Change button text */}
              </button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default SubjectManagement;
