import React, { useEffect, useState } from "react";
import { getSubjects, addSubject } from "../../services/subjectService"; // Import the necessary service functions
import { Button, Modal, Input, message } from "antd"; // Import Ant Design components

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        const addedSubject = await addSubject(newSubject); // Add the subject and get the returned data
        setSubjects([...subjects, addedSubject]); // Optimistically update the UI with the new subject
        setNewSubject({ name: "", description: "" }); // Clear the input fields
        setIsModalVisible(false); // Close the modal
        message.success("Subject added successfully!"); // Show success message
      } catch (error) {
        console.error("Error adding subject:", error);
        message.error("Failed to add subject."); // Show error message
      }
    } else {
      message.warning("Please fill in all fields."); // Show warning if fields are empty
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Subject
      </Button>
      <Modal
        title="Add New Subject"
        visible={isModalVisible}
        onOk={handleAddSubject}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Subject Name"
          value={newSubject.name}
          onChange={(e) =>
            setNewSubject({ ...newSubject, name: e.target.value })
          }
          className="mb-4"
        />
        <Input
          placeholder="Description"
          value={newSubject.description}
          onChange={(e) =>
            setNewSubject({ ...newSubject, description: e.target.value })
          }
          className="mb-4"
        />
      </Modal>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Subject Name</th>
            <th className="py-2 px-4 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id} className="border-b">
              <td className="py-2 px-4">{subject.name}</td>
              <td className="py-2 px-4">{subject.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectManagement;
