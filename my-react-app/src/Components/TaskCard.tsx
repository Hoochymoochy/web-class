import { Link } from "react-router-dom";
import type { Task } from "../App";

type TaskCardProps = {
    task: Task
    onDelete: (id: number) => void
    onComplete: (id: number) => void
};


export default function TaskCard({ task, onDelete, onComplete }: TaskCardProps) {
  return (
    <Link to={`/task/${task.id}`}>
      <div className="border p-4 space-y-3 hover:bg-white/10 hover:cursor-pointer">
        <div className="flex flex-row justify-between">
        <h3 className="text-2xl font-bold">{task.title}</h3>
          {
            task.priority === 1 && <h3 className="bg-red-500 rounded-full p-2"></h3>
          }
          {
            task.priority === 2 && <h3 className="bg-yellow-500 rounded-full p-2"></h3>
          }
          {
            task.priority === 3 && <h3 className="bg-green-500 rounded-full p-2"></h3>
          }
        </div>
        <h3 className="bg-white/10 rounded-md p-2">{task.description}</h3>
        <h3 >{task.dueDate}</h3>
        <p className="space-x-2">
          Status:{" "}
          <strong>{task.completed ? "Completed" : "Not completed"}</strong>
          <input type="checkbox" name="completed" checked={task.completed} onChange={() => onComplete(task.id)}/>
        </p>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        <form>
        </form>
      </div>
    </Link>
  );
};
