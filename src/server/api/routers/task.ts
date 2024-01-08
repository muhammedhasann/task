// Import the modules
import { createRouter } from "@trpc/server";
import { prisma } from "../lib/prisma";

// Define the data types
type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  color: string;
};

// Define the tRPC router
export const appRouter = createRouter()
  // Get all tasks
  .query("tasks", async () => {
    const tasks = await prisma.task.findMany({
      include: {
        category: true,
      },
    });
    return tasks;
  })
  // Create a new task
  .mutation("createTask", async ({ title, description, categoryId }) => {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed: false,
        categoryId,
      },
      include: {
        category: true,
      },
    });
    return task;
  })
  // Get a specific task by id
  .query("task", async ({ id }) => {
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    return task;
  })
  // Update a specific task by id
  .mutation("updateTask", async ({ id, title, description, completed, categoryId }) => {
    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        completed,
        categoryId,
      },
      include: {
        category: true,
      },
    });
    return task;
  })
  // Delete a specific task by id
  .mutation("deleteTask", async ({ id }) => {
    const task = await prisma.task.delete({
      where: {
        id,
      },
    });
    return task;
  })
  // Get all categories
  .query("categories", async () => {
    const categories = await prisma.category.findMany();
    return categories;
  })
  // Create a new category
  .mutation("createCategory", async ({ name, color }) => {
    const category = await prisma.category.create({
      data: {
        name,
        color,
      },
    });
    return category;
  })
  // Get a specific category by id
  .query("category", async ({ id }) => {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    return category;
  })
  // Update a specific category by id
  .mutation("updateCategory", async ({ id, name, color }) => {
    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        color,
      },
    });
    return category;
  })
  // Delete a specific category by id
  .mutation("deleteCategory", async ({ id }) => {
    const category = await prisma.category.delete({
      where: {
        id,
      },
    });
    return category;
  });

// Export the default router
export default appRouter;