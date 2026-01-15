import React from "react";
import { Task } from "../App";

type TaskListProps = {
    tasks: Task[];
};

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>{task.title}</li>
            ))}
        </ul>
    );
};
export default TaskList;