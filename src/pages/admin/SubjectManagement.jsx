import React, { useEffect, useState } from "react";
import { getSubjects, addSubject } from "../../services/subjectService"; // Import the necessary service functions
import { Button, Modal, Input } from "antd"; // Import Ant Design components

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.name.trim() !== "" && newSubject.description.trim() !== "") {
      try {
        await addSubject(newSubject); // Adjust according to the API payload requirements
        setSubjects([...subjects, newSubject]); // Optimistically update the UI
        setNewSubject({ name: "", description: "" }); // Clear the input fields
        setIsModalVisible(false); // Close the modal
      } catch (error) {
        console.error("Error adding subject:", error);
      }
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
          {subjects.map((subject, index) => (
            <tr key={index} className="border-b">
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
