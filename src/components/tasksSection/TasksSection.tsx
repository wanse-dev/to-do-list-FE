import "./TasksSection.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../contexts/authContext";
import { TaskCard } from "../taskCard/TaskCard";
import { CirclePlus, Trash, Pen } from "lucide-react";

import { toast } from "react-toastify";

type TaskProps = {
  _id?: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

const validationsSchema = Joi.object<TaskProps>({
  title: Joi.string().required().messages({
    "string.empty": "You must type something...",
  }),
});

export const TasksSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskProps>({
    resolver: joiResolver(validationsSchema),
  });

  const [data, setData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [taskAdded, setTaskAdded] = useState(false);
  const [taskDeleted, setTaskDeleted] = useState(false);

  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");

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
    } catch (error: any) {
      setError(error.message || "Unknown error");
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

    if (errors.title?.message) {
      toast.error(errors.title.message, {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
    }

    if (taskAdded) {
      toast.success("Task added successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setTaskAdded(false);
    }

    if (taskDeleted) {
      toast.info("Task removed successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setTaskDeleted(false);
    }
  }, [error, errors.title, taskAdded, taskDeleted]);

  const filteredTasks = data.filter((task) => {
    if (filter === "all" && task.isActive) return true;
    if (filter === "done" && task.isActive) return task.isCompleted;
    if (filter === "undone" && task.isActive) return !task.isCompleted;
  });

  const onSubmit = async (data: TaskProps) => {
    const sendData = {
      title: data.title,
      isCompleted: data.isCompleted || false,
      isActive: data.isActive || true,
    };
    const firebaseUID = auth?.currentUser?.uid;
    try {
      const createResponse = await axiosInstance.post(
        "http://localhost:3000/api/task",
        sendData
      );
      const taskId = createResponse.data.data._id;
      await axiosInstance.patch(
        `http://localhost:3000/api/task/assignToUser/${firebaseUID}`,
        { firebaseUID, taskId }
      );
      setTaskAdded(true);
      await fetchData();
      reset();
      console.debug("API response:", createResponse.data);
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  const toggleTask = async (task: TaskProps) => {
    try {
      const taskId = task._id;
      const endpoint = task.isCompleted
        ? `http://localhost:3000/api/task/undone/${taskId}`
        : `http://localhost:3000/api/task/complete/${taskId}`;

      const response = await axiosInstance.patch(endpoint);
      console.debug("API response:", response.data);
      await fetchData();
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  const disableTask = async (task: TaskProps) => {
    try {
      const taskId = task._id;
      const response = await axiosInstance.patch(
        `http://localhost:3000/api/task/disable/${taskId}`
      );
      console.debug("API response:", response.data);
      setTaskDeleted(true);
      await fetchData();
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  return (
    <section className="tasks-list-section">
      <div className="tasks-options">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("done")}>Done</button>
        <button onClick={() => setFilter("undone")}>Undone</button>
      </div>

      {filter === "all" && (
        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          <input {...register("title")} type="text" placeholder="New task..." />
          <button type="submit">
            <CirclePlus size={30} />
          </button>
        </form>
      )}

      <div className="task-cards-wrapper">
        {loading && "Loading..."}
        {filteredTasks.map((task) => {
          const id = task._id;
          const title = task.title;
          const isActive = task.isActive;
          const isCompleted = task.isCompleted;
          return (
            <div key={id} className="task-card-container">
              {filter === "all" && (
                <div className="task-delete-edit-container">
                  <button
                    className="delete-button"
                    onClick={() => disableTask(task)}
                  >
                    <Trash size={15} />
                  </button>
                  <button className="edit-button">
                    <Pen size={15} />
                  </button>
                </div>
              )}
              <TaskCard
                title={title}
                isActive={isActive}
                isCompleted={isCompleted}
              />
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() =>
                  toggleTask({
                    _id: id,
                    title,
                    isActive,
                    isCompleted,
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
