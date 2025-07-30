import "./Tasks.css";
import { useState } from "react";
import { PageTitle } from "../../components/pageTitle/PageTitle";
import { TasksSection } from "../../components/tasksSection/TasksSection";
import { PomodoroSidebar } from "../../components/pomodoroSidebar/PomodoroSidebar";
import { FoldersSidebar } from "../../components/foldersSidebar/FoldersSidebar";
import { ToastContainer } from "react-toastify";

type FolderProps = {
  _id?: string;
  title: string;
};

export const Tasks = () => {
  const [selectedFolder, setSelectedFolder] = useState<FolderProps | null>(null);

  return (
    <div className="tasks-page">
      <PageTitle title="Tasks" subtitle="One step by time." />
      <main className="tasks-main-content">
        <TasksSection selectedFolder={selectedFolder} />
        <aside>
          <FoldersSidebar setSelectedFolder={setSelectedFolder} selectedFolder={selectedFolder} />
          <PomodoroSidebar />
        </aside>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};
