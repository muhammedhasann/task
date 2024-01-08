// Import React and other dependencies
import React, { useState } from "react";
import { trpc } from "../lib/trpc";
import { TaskItem } from "./TaskItem";

export const TaskList = () => {
  const { data, error, isLoading } = trpc.useQuery(["tasks"]);

  const createTaskMutation = trpc.useMutation("tasks.createTask");
  const updateTaskMutation = trpc.useMutation("tasks.updateTask");
  const deleteTaskMutation = trpc.useMutation("tasks.deleteTask");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  // Define a function to handle the form submission for creating a new task
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Use the createTaskMutation function to create a new task with the input values
      await createTaskMutation.mutateAsync({
        title,
        description,
        categoryId,
      });
      // Reset the input values
      setTitle("");
      setDescription("");
      setCategoryId(0);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  // Return the JSX element for rendering the component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Management App</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <label htmlFor="title" className="font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          required
        />
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2"
          rows={4}
          required
        />
        <label htmlFor="category" className="font-medium">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="border rounded p-2"
          required
        >
          <option value={0}>Select a category</option>
          <option value={1}>Personal</option>
          <option value={2}>Work</option>
          <option value={3}>School</option>
          <option value={4}>Hobby</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Create Task
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Something went wrong: {error.message}</p>}
      {data && (
        <ul className="flex flex-col gap-2">
          {data.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              updateTask={updateTaskMutation.mutate}
              deleteTask={deleteTaskMutation.mutate}
            />
          ))}
        </ul>
      )}
    </div>
  );
};