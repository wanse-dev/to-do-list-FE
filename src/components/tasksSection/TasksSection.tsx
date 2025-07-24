import "./TasksSection.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../contexts/authContext";
import { TaskCard } from "../taskCard/TaskCard";
import { CirclePlus } from "lucide-react";

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
    formState: { errors },
  } = useForm<TaskProps>({
    resolver: joiResolver(validationsSchema),
  });

  const [data, setData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [filter, setFilter] = useState<"all" | "done" | "undone">("all"); // aplico este hook para mostrar una pantalla u otra

  const auth = useAuth();

  const fetchData = async () => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      console.debug("Firebase UID:", firebaseUID);
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const response = await axiosInstance.get(
        `http://localhost:3000/api/task/user/${firebaseUID}`
      );
      setData(response.data.data || []);
      console.debug("Data fetched successfully.");
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

  const filteredTasks = data.filter((task) => {
    if (filter === "done") return task.isCompleted;
    if (filter === "undone") return !task.isCompleted;
    return true; // si no es ni done, ni undone, entonces va a ser "all"
  });

  const onSubmit = async (data: TaskProps) => {
    const sendData = {
      title: data.title,
      isCompleted: data.isCompleted,
      isActive: data.isActive,
    };
    const firebaseUID = auth?.currentUser?.uid;
    try {
      const createResponse = await axiosInstance.post( // creo un nuevo task
        "http://localhost:3000/api/task",
        sendData
      );
      const taskId = createResponse.data.data._id;
      await axiosInstance.patch( // asigno el task al array del usuario autenticado
        `http://localhost:3000/api/task/assignToUser/${firebaseUID}`,
        { firebaseUID, taskId }
      );
      await fetchData();
      console.debug("Task created: ", createResponse.data);
    } catch (error) {
      console.debug("Error creating task: ", error);
    }
  };

  return (
    <section className="tasks-list-section">
      <div className="tasks-options">
        <button onClick={() => setFilter("undone")}>Undone</button>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("done")}>Done</button>
      </div>

      {filter === "all" && (
        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          <input {...register("title")} type="text" placeholder="New task..." />
          <button type="submit">
            <CirclePlus size={30} />
          </button>
          {errors.title && <span>{errors.title.message}</span>}
        </form>
      )}

      <div className="task-cards-wrapper">
        {error && (
          <p>
            {error.name}: {error.message}
          </p>
        )}

        {loading && "Loading..."}
        {filteredTasks.map((task) => {
          const id = task._id;
          const title = task.title;
          const isActive = task.isActive;
          const isCompleted = task.isCompleted;
          return (
            <div key={id} className="task-card-container">
              <TaskCard
                title={title}
                isActive={isActive}
                isCompleted={isCompleted}
              />
              <input type="checkbox" name="" id="" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
