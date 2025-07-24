import "./RecycleBin.css";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../contexts/authContext";
import { TaskCard } from "../../components/taskCard/TaskCard";
import { Undo2, Trash } from "lucide-react";

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

      await fetchData();
    } catch (error: any) {
      console.debug("Error enabling task: ", error);
    }
  };

  const deleteTask = async (task: TaskProps) => {
    try {
      const taskId = task._id;
      const response = await axiosInstance.delete(
        `http://localhost:3000/api/task/${taskId}`
      );
      console.debug("API response:", response.data);

      await fetchData();
    } catch (error: any) {
      console.debug("Error deleting task: ", error);
    }
  };

  return (
    <section className="tasks-list-section">
      <div className="task-cards-wrapper">
        {error && (
          <p>
            {error.name}: {error.message}
          </p>
        )}

        {loading && "Loading..."}
        {disabledTasks.map((task) => {
          const id = task._id;
          const title = task.title;
          const isActive = task.isActive;
          const isCompleted = task.isCompleted;
          return (
            <div key={id} className="task-card-container">
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
                title={title}
                isActive={isActive}
                isCompleted={isCompleted}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
