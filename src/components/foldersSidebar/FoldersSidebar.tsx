import "./FoldersSidebar.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { FolderCard } from "../folderCard/FolderCard";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../contexts/authContext";
import { ArrowDownIcon, CirclePlus, Trash, Pen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

type FolderProps = {
  _id?: string;
  title: string;
};

type SelectedFolderProps = {
  selectedFolder: FolderProps | null;
  setSelectedFolder: (folder: FolderProps | null) => void;
};

const validationsSchema = Joi.object<FolderProps>({
  title: Joi.string().required().max(30).messages({
    "string.empty": "You must type something...",
    "string.max": "Title must be less than 30 characters.",
  }),
});

export const FoldersSidebar = ({
  setSelectedFolder,
  selectedFolder,
}: SelectedFolderProps) => {
  const {
    register: registerFolderCreate,
    handleSubmit: handleFolderCreateSubmit,
    reset: resetFolderCreate,
    formState: { errors: createFolderErrors },
  } = useForm<FolderProps>({
    resolver: joiResolver(validationsSchema),
  });

  const {
    register: registerFolderEdit,
    handleSubmit: handleFolderEditSubmit,
    formState: { errors: editFolderErrors },
    reset: resetFolderEdit,
  } = useForm<FolderProps>({
    resolver: joiResolver(validationsSchema),
  });

  const [data, setData] = useState<FolderProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  const [folderAdded, setFolderAdded] = useState<FolderProps | null>(null);
  const [folderDeleted, setFolderDeleted] = useState<FolderProps | null>(null);
  const [folderEdited, setFolderEdited] = useState<FolderProps | null>(null);
  const [editingFolder, setEditingFolder] = useState<FolderProps | null>(null);

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const savedState = localStorage.getItem("foldersSidebarExpanded");
    return savedState !== null ? JSON.parse(savedState) : true;
  }); // uso un lazy initializer para que la función se ejecute una sola vez al inicio, y ahorro recursos

  const auth = useAuth();

  const fetchData = async () => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const response = await axiosInstance.get(
        `http://localhost:3000/api/folder/user/${firebaseUID}`
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
    localStorage.setItem("foldersSidebarExpanded", JSON.stringify(isExpanded));
    document.body.style.setProperty(
      "--current-foldersSection-height",
      isExpanded
        ? "var(--foldersSection-expanded-height)"
        : "var(--foldersSection-collapsed-height)"
    );
  }, [isExpanded]);

  useEffect(() => {
    if (error) {
      toast.error(String(error), {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: false,
      });
    }

    if (createFolderErrors.title?.message) {
      toast.error(createFolderErrors.title.message, {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
    }

    if (editFolderErrors.title?.message) {
      toast.error(editFolderErrors.title.message, {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
    }

    if (folderAdded) {
      toast.success("Folder added successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setFolderAdded(null);
    }

    if (folderDeleted) {
      toast.info("Folder removed successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setFolderDeleted(null);
    }

    if (folderEdited) {
      toast.success("Folder updated successfully", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: false,
      });
      setFolderEdited(null);
    }
  }, [
    error,
    createFolderErrors.title,
    editFolderErrors.title,
    folderAdded,
    folderDeleted,
    folderEdited,
  ]);

  const onSubmit = async (folder: FolderProps) => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      const sendData = {
        firebaseUid: firebaseUID,
        title: folder.title,
      };
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const response = await axiosInstance.post(
        `http://localhost:3000/api/folder/`,
        sendData
      );

      setFolderAdded(response.data.data);

      setSelectedFolder(response.data.data);
      // guardo la carpeta seleccionada en localStorage
      localStorage.setItem(
        "selectedFolder",
        JSON.stringify(response.data.data)
      );

      await fetchData();
      resetFolderCreate();
      console.debug("API response:", response.data);
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  const editFolder = async (folder: FolderProps) => {
    try {
      const folderId = folder._id;
      if (!folderId) {
        throw new Error("Folder ID is missing");
      }
      const response = await axiosInstance.patch(
        `http://localhost:3000/api/folder/update/${folderId}`,
        { title: folder.title }
      );
      console.debug("API response:", response.data);
      setFolderEdited(folder);
      setEditingFolder(null);
      resetFolderEdit();
      await fetchData();
    } catch (error: any) {
      setError(error.message || "Unknown error");
    }
  };

  const deleteFolder = async (folder: FolderProps) => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      const folderId = folder._id;
      if (!firebaseUID || !folderId) {
        throw new Error("User is not authenticated or folder ID is missing");
      }
      const deleteResponse = await axiosInstance.delete(
        `http://localhost:3000/api/folder/${folderId}/${firebaseUID}`
      );

      setFolderDeleted(folder);
      await fetchData();
      console.debug("API response:", deleteResponse.data);
      setError(null);

      // si el user llega a borrar la fplder seleccionada, entonces vuelve a "all" y se guarda el estado en localStorage
      if (selectedFolder?._id === folder._id) {
        setSelectedFolder({ _id: "all", title: "All" });
        localStorage.setItem(
          "selectedFolder",
          JSON.stringify({ _id: "all", title: "All" })
        );
      }
    } catch (error: any) {
      console.debug("Error deleting folder: ", error);
    }
  };

  const toggleFolders = () => {
    setIsExpanded((prev: any) => !prev);
  };

  return (
    <motion.section
      className={`folders-sidebar ${isExpanded ? "expanded" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <header>
        <h2>Folders</h2>
        <button onClick={toggleFolders}>
          {isExpanded ? (
            <ArrowDownIcon size={20} style={{ transform: "rotate(180deg)" }} />
          ) : (
            <ArrowDownIcon size={20} />
          )}
        </button>
      </header>
      <form
        onSubmit={handleFolderCreateSubmit(onSubmit)}
        className="folder-form"
      >
        <input
          {...registerFolderCreate("title")}
          type="text"
          placeholder="New folder..."
        />
        <button type="submit">
          <CirclePlus size={30} />
        </button>
      </form>
      <div className="folders-list-container">
        {loading && "Loading..."}
        <AnimatePresence mode="popLayout">
          <motion.div
            key="all-folder"
            className="folder-card-container"
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
            <FolderCard
              title="ALL"
              onClick={() => {
                setSelectedFolder({ _id: "all", title: "All" });
                localStorage.setItem(
                  "selectedFolder",
                  JSON.stringify({ _id: "all", title: "All" })
                );
              }}
              isSelected={selectedFolder?._id === "all"}
            />
          </motion.div>

          {data.map((folder) => {
            const id = folder._id;
            const title = folder.title;
            return (
              <motion.div
                key={id}
                className="folder-card-container"
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
                <div className="folder-delete-edit-container">
                  <button
                    className="delete-button"
                    onClick={() => deleteFolder(folder)}
                  >
                    <Trash size={15} />
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => setEditingFolder(folder)}
                  >
                    <Pen size={15} />
                  </button>
                </div>
                {editingFolder?._id === folder._id ? (
                  <form
                    onSubmit={handleFolderEditSubmit((data) =>
                      editFolder({
                        _id: id,
                        title: data.title,
                      })
                    )}
                    className="folder-form"
                  >
                    <input
                      {...registerFolderEdit("title", { value: title })}
                      type="text"
                      className="folder-edit-input"
                      autoFocus
                    />
                  </form>
                ) : (
                  <FolderCard
                    title={title}
                    onClick={() => {
                      setSelectedFolder(folder);
                      localStorage.setItem(
                        "selectedFolder",
                        JSON.stringify(folder)
                      );
                    }}
                    isSelected={selectedFolder?._id === folder._id}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
