import "./TaskCard.css";
import React from "react";

type TaskProps = {
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

export const TaskCard = React.memo(({ title, isCompleted }: TaskProps) => {
  return (
    <div className="task-card">
      <span className={isCompleted ? "task-completed" : ""}>{title}</span>
    </div>
  );
});
