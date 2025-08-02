import { toast } from "react-toastify";
import type { FieldErrors } from "react-hook-form";

type TaskProps = {
  _id?: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

type FolderProps = {
  _id?: string;
  title: string;
};

type RecicleBinToastsProps = {
  error: Error | null;
  taskDeleted: TaskProps | null;
  taskRecovered: TaskProps | null;
  setTaskDeleted?: (task: TaskProps | null) => void;
  setTaskRecovered?: (task: TaskProps | null) => void;
};

type FoldersSidebarToastsProps = {
  error: Error | null;
  createFolderErrors: FieldErrors<FolderProps>;
  editFolderErrors: FieldErrors<FolderProps>;
  folderAdded: FolderProps | null;
  folderDeleted: FolderProps | null;
  folderEdited: FolderProps | null;
  setFolderAdded?: (folder: FolderProps | null) => void;
  setFolderDeleted?: (folder: FolderProps | null) => void;
  setFolderEdited?: (folder: FolderProps | null) => void;
};

type TasksSectionToastsProps = {
  error: Error | null;
  createErrors: FieldErrors<TaskProps>;
  editErrors: FieldErrors<TaskProps>;
  taskAdded: TaskProps | null;
  taskDeleted: TaskProps | null;
  taskEdited: TaskProps | null;
  setTaskAdded?: (task: TaskProps | null) => void;
  setTaskDeleted?: (task: TaskProps | null) => void;
  setTaskEdited?: (task: TaskProps | null) => void;
};

const recicleBinToasts = (props: RecicleBinToastsProps) => {
  const {
    error,
    taskDeleted,
    taskRecovered,
    setTaskDeleted,
    setTaskRecovered,
  } = props;

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

    if (setTaskDeleted) {
      setTaskDeleted(null);
    }
  }

  if (taskRecovered) {
    toast.info("Task recovered successfully", {
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setTaskRecovered) {
      setTaskRecovered(null);
    }
  }
};

const foldersSidebarToasts = (props: FoldersSidebarToastsProps) => {
  const {
    error,
    createFolderErrors,
    editFolderErrors,
    folderAdded,
    folderDeleted,
    folderEdited,
    setFolderAdded,
    setFolderDeleted,
    setFolderEdited,
  } = props;

  if (error) {
    toast.error(String(error), {
      toastId: "folder-error-toast",
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: false,
    });
  }

  if (createFolderErrors.title?.message) {
    toast.error(createFolderErrors.title.message, {
      toastId: "folder-create-error-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });
  }

  if (editFolderErrors.title?.message) {
    toast.error(editFolderErrors.title.message, {
      toastId: "folder-edit-error-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });
  }

  if (folderAdded) {
    toast.success("Folder added successfully", {
      toastId: "folder-added-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setFolderAdded) {
      setFolderAdded(null);
    }
  }

  if (folderDeleted) {
    toast.info("Folder removed successfully", {
      toastId: "folder-deleted-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setFolderDeleted) {
      setFolderDeleted(null);
    }
  }

  if (folderEdited) {
    toast.success("Folder updated successfully", {
      toastId: "folder-edited-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setFolderEdited) {
      setFolderEdited(null);
    }
  }
};

const foldersSectionToasts = (props: TasksSectionToastsProps) => {
  const {
    error,
    createErrors,
    editErrors,
    taskAdded,
    taskDeleted,
    taskEdited,
    setTaskAdded,
    setTaskDeleted,
    setTaskEdited,
  } = props;

  if (error) {
    toast.error(String(error), {
      toastId: "task-error-toast", // ID único para cada toast, evita duplicados
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: false,
    });
  }

  if (createErrors.title?.message) {
    toast.error(createErrors.title.message, {
      toastId: "task-create-error-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });
  }

  if (editErrors.title?.message) {
    toast.error(editErrors.title.message, {
      toastId: "task-edit-error-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });
  }

  if (taskAdded) {
    toast.success("Task added successfully", {
      toastId: "task-added-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setTaskAdded) {
      setTaskAdded(null);
    }
  }

  if (taskDeleted) {
    toast.info("Task removed successfully", {
      toastId: "task-deleted-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setTaskDeleted) {
      setTaskDeleted(null);
    }
  }

  if (taskEdited) {
    toast.success("Task updated successfully", {
      toastId: "task-edited-toast",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: true,
      draggable: false,
    });

    if (setTaskEdited) {
      setTaskEdited(null);
    }
  }
};

export { recicleBinToasts, foldersSidebarToasts, foldersSectionToasts };
