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
  const [selectedSubject, setSelectedSubject] = useState(null); // To hold the subject being edited

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects(); // Fetch subjects using the service
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        message.error("Failed to fetch subjects."); // Show error message
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.name.trim() !== "" && newSubject.description.trim() !== "") {
      try {
        const addedSubject = await addSubject(newSubject); // Add the subject
        setSubjects([...subjects, addedSubject]); // Update UI
        setNewSubject({ name: "", description: "" }); // Clear input fields
        setIsModalVisible(false); // Close modal
        message.success("Subject added successfully!"); // Show success message
      } catch (error) {
        console.error("Error adding subject:", error);
        message.error("Failed to add subject."); // Show error message
      }
    } else {
      message.warning("Please fill in all fields."); // Warning for empty fields
    }
  };

  const handleEditSubject = async () => {
    if (
      selectedSubject.name.trim() !== "" &&
      selectedSubject.description.trim() !== ""
    ) {
      try {
        await updateSubject(selectedSubject.id, selectedSubject); // Update the subject
        setSubjects(
          subjects.map((subject) =>
            subject.id === selectedSubject.id ? selectedSubject : subject
          )
        ); // Update UI
        setSelectedSubject(null); // Clear selected subject
        setIsModalVisible(false); // Close modal
        message.success("Subject updated successfully!"); // Show success message
      } catch (error) {
        console.error("Error updating subject:", error);
        message.error("Failed to update subject."); // Show error message
      }
    } else {
      message.warning("Please fill in all fields."); // Warning for empty fields
    }
  };

  const handleToggleSubjectStatus = async (subjectId, currentActiveStatus) => {
    try {
      await toggleSubjectStatus(subjectId, currentActiveStatus); // Call API to toggle the active status
      setSubjects(
        subjects.map((subject) =>
          subject.id === subjectId
            ? { ...subject, active: !subject.active } // Toggle active status in UI
            : subject
        )
      );
      message.success(
        `Subject ${currentActiveStatus ? "blocked" : "activated"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling subject status:", error);
      message.error("Failed to update subject status."); // Show error message
    }
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject); // Set the subject to be edited
    setIsEditMode(true); // Set to edit mode
    setIsModalVisible(true); // Open modal
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
              <Button
                type="link"
                danger={subject.active}
                onClick={() =>
                  handleToggleSubjectStatus(subject.id, subject.active)
                }
              >
                {subject.active ? "Block" : "Blocked"}
              </Button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default SubjectManagement;
