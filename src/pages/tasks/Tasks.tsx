import "./Tasks.css";
import { useState } from "react";
import { PageTitle } from "../../components/pageTitle/PageTitle";
import { TasksSection } from "../../components/tasksSection/TasksSection";
import { PomodoroSidebar } from "../../components/pomodoroSidebar/PomodoroSidebar";
import { FoldersSidebar } from "../../components/foldersSidebar/FoldersSidebar";
import { ToastContainer } from "react-toastify";

export const Tasks = () => {
  const [selectedFolder, setSelectedFolder] = useState<any>(() => {
    const savedState = localStorage.getItem("selectedFolder");
    return savedState !== null
      ? JSON.parse(savedState)
      : { _id: "all", title: "All" };
  });

  return (
    <div className="tasks-page">
      <PageTitle title="Tasks" subtitle="Manage your tasks." />
      <main className="tasks-main-content">
        <TasksSection selectedFolder={selectedFolder} />
        <aside>
          <FoldersSidebar
            setSelectedFolder={setSelectedFolder}
            selectedFolder={selectedFolder}
          />
          <PomodoroSidebar />
        </aside>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};
