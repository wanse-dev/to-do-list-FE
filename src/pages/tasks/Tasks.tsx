import "./Tasks.css";
import { useState, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    const keepServerAlive = async () => {
      try {
        await axios.get("https://to-do-list-be-qtlb.onrender.com/ping", {});
        console.log("Ping sent successfully");
      } catch (error) {
        console.error("Error sending ping: ", error);
      }
    };
    const intervalId = setInterval(keepServerAlive, 300000); // envío ping cada 5 minutos (300000 ms)

    return () => clearInterval(intervalId); // limpio el intervalo cuando el componente se desmonta
  }, []);

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
