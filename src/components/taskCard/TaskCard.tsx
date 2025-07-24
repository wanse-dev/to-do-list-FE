import "./TaskCard.css";

type TaskProps = {
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

export const TaskCard = (props : TaskProps) => {
  return (
    <div className="task-card">
      <span>{props.title}</span>
    </div>
  );
};
