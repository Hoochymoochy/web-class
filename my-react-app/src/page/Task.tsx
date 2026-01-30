import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Task } from "../Type";


function Task() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const task = JSON.parse(localStorage.getItem("tasks") || "[]").find((task: Task) => task.id === Number(id));
    setTask(task);

  }, [id]);

  return (
    <div>
      <h2>{task?.title ?? "Task not found"}</h2>
      <h2>{task?.description ?? "Task not found"}</h2>
      <h2>{task?.dueDate ?? "Task not found"}</h2>
      <h2>{task?.priority ?? "Task not found"}</h2>
    </div>
  );
}

export default Task;
