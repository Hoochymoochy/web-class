import React from "react";
import TaskCard from "./TaskCard";
type TaskListProps = {
    tasks: Task[];
    onDelete: (id: number) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete }) => {
  return (
        <div>
            {tasks.map((task) => (
                <TaskCard task={task} onDelete={onDelete} />
            ))}
        </div>
  );
};
export default TaskList;