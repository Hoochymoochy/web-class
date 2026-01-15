import React from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../App";
type TaskListProps = {
    tasks: Task[];
    onDelete: (id: number) => void;
    handleCompleteTask: (id: number) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, handleCompleteTask }) => {
  return (
        <div>
            {tasks.map((task) => (
                <TaskCard task={task} onDelete={onDelete} onComplete={handleCompleteTask} />
            ))}
        </div>
  );
};
export default TaskList;