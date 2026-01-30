import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function Task() {
  const { id } = useParams();
  const [task, setTask] = useState<TaskType | null>(null);

  useEffect(() => {
    if (!id) return;

    const tasks: TaskType[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );

    console.log(id)




    const foundTask = tasks.find(task => task.id === id);
    console.log(foundTask)
    setTask(foundTask || null);
  }, [id]);

  return (
    <div>
      <h2>{task?.title ?? "Task not found"}</h2>
    </div>
  );
}

export default Task;
