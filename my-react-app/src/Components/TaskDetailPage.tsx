import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Task } from "../Type";

function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const storedTasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") ?? "[]"
    );

    const foundTask = storedTasks.find(
      (t) => t.id === Number(id)
    );

    setTask(foundTask ?? null);
  }, [id]);

  if (!task) {
    return (
      <div className="bg-white/10 rounded-md p-10 text-center">
        <h2 className="text-4xl">Task not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-md p-10 border border-white/20">
      <h2 className="text-4xl text-center mb-6">{task.title}</h2>

      <div className="grid grid-cols-2 gap-4">
        <p className="text-center">
          <strong>Description:</strong> {task.description}
        </p>

        <p className="text-center">
          <strong>Due date:</strong> {task.dueDate}
        </p>

        <p className="text-center">
          <strong>Priority:</strong>{" "}
          {task.priority === 1 ? (
            <span className="inline-block bg-red-500 rounded-full px-3 py-1 ml-2">
              High
            </span>
          ) : (
            "Normal"
          )}
        </p>

        <p className="text-center">
          <strong>Status:</strong>{" "}
          {task.completed ? "Completed" : "Not completed"}
        </p>
      </div>
    </div>
  );
}

export default TaskDetailPage;
