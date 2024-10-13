import React, { useState } from "react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Technology" },
    { id: 2, name: "Science" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([
        ...categories,
        { id: categories.length + 1, name: newCategory },
      ]);
      setNewCategory("");
    }
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
          placeholder="New Category"
        />
        <button
          onClick={handleAddCategory}
          className="ml-2 bg-green-500 text-white p-2 rounded-lg"
        >
          Add
        </button>
      </div>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="py-2 px-4 text-left">Category Name</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b dark:border-gray-700">
              <td className="py-2 px-4">{category.name}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;
