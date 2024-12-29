# Planify

**Planify** is a versatile task management platform designed to simplify the process of organizing, tracking, and prioritizing tasks. Drawing inspiration from platforms like Trello, Planify combines simplicity with functionality, making it easy to manage individual or team tasks.

## Overview

Planify provides an intuitive and user-friendly interface for managing tasks, allowing you to organize them by category, priority, or status. Whether you're managing a team project or just your personal to-do list, Planify adapts to your needs, offering flexibility and ease of use.

### Key Features

- **Task Boards**: Visual boards that help you organize tasks by category, priority, or status. You can create multiple boards, each tailored to a specific project or task group.
- **Two Board Types**:

  - **Task Type**: Create boards where you can add multiple task boxes. Each box can contain tasks that can be easily moved or reordered using drag-and-drop functionality.
  - **Draw Type** (Upcoming): A dynamic board that lets you draw and insert text and shapes to represent ideas, processes, or project planning.

- **Drag-and-Drop Interface**: Easily move tasks between different boxes or reorder tasks within a box using a drag-and-drop interface. This allows for quick adjustments and smooth workflow management.

- **Customizable Workflow**: Create unique workflows that adapt to the needs of your project. Whether you want to track tasks, set deadlines, or visualize ideas, Planify gives you the flexibility to do so.

- **Local Storage Management**: All boards, tasks, and settings are saved locally in the browser’s local storage for easy access and persistence, without the need for an external database.

- **Upcoming Features**: The Draw Type board will allow users to create dynamic drawings with text and shapes, making it easier to visualize ideas and processes.

## Technologies Used

- **React** with **TypeScript**: A modern JavaScript library with static typing, providing a robust and type-safe development experience.
- **React Router DOM**: Enables client-side routing for seamless navigation between boards and other pages.
- **React Icons**: For easy integration of various icons to improve the user interface and experience.
- **React DnD**: A library that facilitates drag-and-drop functionality, allowing users to move tasks across boxes and reorder them effortlessly.
- **Tailwind CSS**: A utility-first CSS framework that powers the UI components with responsive and customizable styles.
- **UUID**: Used to generate unique IDs for boards, tasks, and boxes for reliable identification and management.
- **Konva.js**: A powerful canvas library for drawing interactive shapes and text, providing advanced drawing capabilities for the Draw Type board.

## Architecture & Performance

- **useContext**: Used for managing user authentication and global state (such as boards, tasks, and settings). This allows for centralized state management and easy access to data across components.
- **useMemo**: Helps optimize performance by memoizing expensive operations like filtering and sorting tasks, ensuring that unnecessary re-renders are avoided.

- **Lazy Loading**: Implemented for route-based code splitting, improving performance by loading only the necessary components when needed. This enhances the overall speed and responsiveness of the application.

## Conclusion

Planify is an evolving task management tool that provides users with both simple and powerful features to manage tasks. Whether you're a solo user or part of a team, Planify offers a flexible platform to help you stay organized and productive.
