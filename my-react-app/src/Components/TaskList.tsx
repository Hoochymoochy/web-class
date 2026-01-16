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
    <div className="container mx-auto p-4">
        <h2 className="text-4xl font-bold mb-4">Task List</h2>
        <div className="grid grid-cols-3 gap-4">
            {tasks.map((task) => (
                <TaskCard task={task} onDelete={onDelete} onComplete={handleCompleteTask} />
            ))}
        </div>
    </div>
  );
};
export default TaskList;