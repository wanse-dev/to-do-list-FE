import "./RecycleBin.css";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../contexts/authContext";
import { TaskCard } from "../../components/taskCard/TaskCard";
import { PageTitle } from "../../components/pageTitle/PageTitle";
import { Undo2, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

type TaskProps = {
  _id?: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

export const RecycleBin = () => {
  const [data, setData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [taskDeleted, setTaskDeleted] = useState<TaskProps | null>(null);
  const [taskRecovered, setTaskRecovered] = useState<TaskProps | null>(null);

  const auth = useAuth();

  const fetchData = async () => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const response = await axiosInstance.get(
        `http://localhost:3000/api/task/user/${firebaseUID}`
      );
      setData(response.data.data || []);
      console.debug("API response:", response.data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(String(error), {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: false,
      });
    }

    if (taskDeleted) {
      toast.info("Task removed successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setTaskDeleted(null);
    }

    if (taskRecovered) {
      toast.info("Task recovered successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setTaskRecovered(null);
    }
  }, [error, taskDeleted, taskRecovered]);

  const disabledTasks = data.filter((task) => {
    // filtro los tasks que el usuario "eliminó"
    return !task.isActive ? true : false;
  });

  const recoverTask = async (task: TaskProps) => {
    try {
      const taskId = task._id;
      const response = await axiosInstance.patch(
        `http://localhost:3000/api/task/enable/${taskId}`
      );
      console.debug("API response:", response.data);
      setTaskRecovered(task);
      await fetchData();
    } catch (error: any) {
      console.debug("Error enabling task: ", error);
    }
  };

  const deleteTask = async (task: TaskProps) => {
    const firebaseUID = auth?.currentUser?.uid;
    try {
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const taskId = task._id;
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
      await axiosInstance.patch(
        `http://localhost:3000/api/task/removeFromUser/${firebaseUID}`,
        { taskId }
      );
      const deleteResponse = await axiosInstance.delete(
        `http://localhost:3000/api/task/${taskId}`
      );
      setTaskDeleted(task);
      await fetchData();
      console.debug("API response:", deleteResponse.data);
      setError(null);
    } catch (error: any) {
      console.debug("Error deleting task: ", error);
    }
  };

  return (
    <div className="recycle-bin-page">
      <PageTitle
        title="Recycle bin"
        subtitle="Recover your deleted tasks, or delete them for ever."
      />
      <main className="recycle-bin-main-content">
        <motion.section
          className="tasks-list-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="task-cards-wrapper">
            {loading && "Loading..."}
            {error && (
              <p>
                {error.name}: {error.message}
              </p>
            )}
            <AnimatePresence mode="popLayout">
              {disabledTasks.map((task) => (
                <motion.div
                  key={task._id}
                  className="task-card-container"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: 200,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  layout
                >
                  <div className="task-recover-delete-container">
                    <button
                      className="recover-button"
                      onClick={() => recoverTask(task)}
                    >
                      <Undo2 size={15} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task)}
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                  <TaskCard
                    title={task.title}
                    isActive={task.isActive}
                    isCompleted={task.isCompleted}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
