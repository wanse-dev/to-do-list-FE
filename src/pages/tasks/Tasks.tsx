import "./Tasks.css";
import { PageTitle } from "../../components/pageTitle/PageTitle";
import { TasksSection } from "../../components/tasksSection/TasksSection";
import { PomodoroSidebar } from "../../components/pomodoroSidebar/PomodoroSidebar";
import { ToastContainer } from "react-toastify";

export const Tasks = () => {
  return (
    <div className="tasks-page">
      <PageTitle title="Tasks" subtitle="One step by time." />
      <main className="tasks-main-content">
        <TasksSection />
        <PomodoroSidebar />
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};
