import "./TasksSection.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { CirclePlus, Trash, Pen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../contexts/authContext";
import { TaskCard } from "../taskCard/TaskCard";
import { foldersSectionToasts } from "../toasts/toasts";

type TaskProps = {
  _id?: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

type TasksSectionProps = {
  selectedFolder: { _id?: string; title: string } | null;
};

const validationsSchema = Joi.object<TaskProps>({
  title: Joi.string().required().max(150).messages({
    "string.empty": "You must type something...",
    "string.max": "Title must be less than 150 characters.",
  }),
});

export const TasksSection = ({ selectedFolder }: TasksSectionProps) => {
  const [data, setData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [taskAdded, setTaskAdded] = useState<TaskProps | null>(null);
  const [taskDeleted, setTaskDeleted] = useState<TaskProps | null>(null);
  const [taskEdited, setTaskEdited] = useState<TaskProps | null>(null);
  const [editingTask, setEditingTask] = useState<TaskProps | null>(null);

  const [filter, setFilter] = useState<"tasks" | "done" | "undone">("tasks");

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

  const auth = useAuth();

  const fetchData = async () => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }

      const folderId = selectedFolder?._id;
      // el endpoint depende si el folderId es "all" o un ID de carpeta en específico
      const endpoint =
        folderId && folderId !== "all"
          ? `/task/folder/${folderId}`
          : `/task/user/${firebaseUID}`;

      const response = await axiosInstance.get(endpoint);
      setData(response.data.data || []);
      console.debug("API response:", response.data);
    } catch (error: any) {
      setError(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaskProps) => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      const sendData = {
        firebaseUid: firebaseUID,
        title: data.title,
        isCompleted: data.isCompleted || false,
        isActive: data.isActive || true,
        folderId: selectedFolder?._id || null,
      };
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const response = await axiosInstance.post(`/task/`, sendData);
      setTaskAdded(response.data.data);
      await fetchData();
      resetCreate();
      console.debug("API response:", response.data);
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  const toggleTask = async (task: TaskProps) => {
    try {
      const taskId = task._id;
      const endpoint = task.isCompleted
        ? `/task/undone/${taskId}`
        : `/task/complete/${taskId}`;
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
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
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
      const response = await axiosInstance.patch(`/task/disable/${taskId}`);
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
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
      const response = await axiosInstance.patch(`/task/update/${taskId}`, {
        title: task.title,
      });
      console.debug("API response:", response.data);
      setTaskEdited(task);
      setEditingTask(null);
      resetEdit();
      await fetchData();
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFolder]);

  useEffect(() => {
    foldersSectionToasts({
      error,
      createErrors,
      editErrors,
      taskAdded,
      taskDeleted,
      taskEdited,
      setTaskAdded,
      setTaskDeleted,
      setTaskEdited,
    });
  }, [
    error,
    createErrors.title,
    editErrors.title,
    taskAdded,
    taskDeleted,
    taskEdited,
  ]);

  const filteredTasks = data.filter((task) => {
    if (filter === "tasks" && task.isActive) return true;
    if (filter === "done" && task.isActive) return task.isCompleted;
    if (filter === "undone" && task.isActive) return !task.isCompleted;
    return false;
  });

  return (
    <motion.section
      className="tasks-list-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="tasks-options">
        <button
          className={filter === "tasks" ? "active-section" : ""}
          onClick={() => setFilter("tasks")}
        >
          Tasks
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

      {filter === "tasks" &&
        selectedFolder?._id !== "all" && ( // muestro el input solo si el folder seleccionado no es "all", y si el filtro está en tasks
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

      {filter === "tasks" && selectedFolder?._id === "all" && (
        <span className="unselected-folder-error">
          You must add a task in a folder created by yourself. ("ALL" is not a
          folder, it's just a filter)
        </span>
      )}

      <div className="task-cards-wrapper">
        {loading && "Loading..."}
        {filter === "tasks" &&
          filteredTasks.length === 0 &&
          selectedFolder?._id !== "all" && (
            <span className="no-tasks-message">No tasks in this folder</span>
          )}
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
                {filter === "tasks" && (
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
