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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

type TaskProps = {
  _id?: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

const validationsSchema = Joi.object<TaskProps>({
  title: Joi.string().required().max(150).messages({
    "string.empty": "You must type something...",
    "string.max": "Title must be less than 150 characters.",
  }),
});

export const TasksSection = () => {
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<TaskProps>({
    resolver: joiResolver(validationsSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors },
    reset: resetEdit,
  } = useForm<TaskProps>({
    resolver: joiResolver(validationsSchema),
  });

  const [data, setData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  const [taskAdded, setTaskAdded] = useState<TaskProps | null>(null);
  const [taskDeleted, setTaskDeleted] = useState<TaskProps | null>(null);
  const [taskEdited, setTaskEdited] = useState<TaskProps | null>(null);
  const [editingTask, setEditingTask] = useState<TaskProps | null>(null);

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

    if (createErrors.title?.message) {
      toast.error(createErrors.title.message, {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
    }

    if (editErrors.title?.message) {
      toast.error(editErrors.title.message, {
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
      setTaskAdded(null);
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

    if (taskEdited) {
      toast.success("Task updated successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setTaskEdited(null);
    }
  }, [
    error,
    createErrors.title,
    editErrors.title,
    taskAdded,
    taskDeleted,
    taskEdited,
  ]);

  const filteredTasks = data.filter((task) => {
    if (filter === "all" && task.isActive) return true;
    if (filter === "done" && task.isActive) return task.isCompleted;
    if (filter === "undone" && task.isActive) return !task.isCompleted;
    return false;
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
      setTaskAdded(createResponse.data.data);
      await fetchData();
      resetCreate();
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
      setTaskDeleted(task);
      await fetchData();
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  const editTask = async (task: TaskProps) => {
    try {
      const taskId = task._id;
      const response = await axiosInstance.patch(
        `http://localhost:3000/api/task/update/${taskId}`,
        { title: task.title }
      );
      console.debug("API response:", response.data);
      setTaskEdited(task);
      setEditingTask(null);
      resetEdit();
      await fetchData();
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  return (
    <motion.section
      className="tasks-list-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="tasks-options" >
        <button
          className={filter === "all" ? "active-section" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "done" ? "active-section" : ""}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
        <button
          className={filter === "undone" ? "active-section" : ""}
          onClick={() => setFilter("undone")}
        >
          Undone
        </button>
      </div>

      {filter === "all" && (
        <form onSubmit={handleCreateSubmit(onSubmit)} className="task-form">
          <input
            {...registerCreate("title")}
            type="text"
            placeholder="New task..."
          />
          <button type="submit">
            <CirclePlus size={30} />
          </button>
        </form>
      )}

      <div className="task-cards-wrapper">
        {loading && "Loading..."}
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const id = task._id;
            const title = task.title;
            const isActive = task.isActive;
            const isCompleted = task.isCompleted;
            return (
              <motion.div
                key={id}
                className="task-card-container"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  x: -100,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                layout
              >
                {filter === "all" && (
                  <div className="task-delete-edit-container">
                    <button
                      className="delete-button"
                      onClick={() => disableTask(task)}
                    >
                      <Trash size={15} />
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => setEditingTask(task)}
                    >
                      <Pen size={15} />
                    </button>
                  </div>
                )}
                {editingTask?._id === task._id ? (
                  <form
                    onSubmit={handleEditSubmit((data) =>
                      editTask({
                        _id: id,
                        title: data.title,
                        isActive,
                        isCompleted,
                      })
                    )}
                    className="task-form"
                  >
                    <input
                      {...registerEdit("title", { value: title })}
                      type="text"
                      className="task-edit-input"
                      autoFocus
                    />
                  </form>
                ) : (
                  <TaskCard
                    title={title}
                    isActive={isActive}
                    isCompleted={isCompleted}
                  />
                )}
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
