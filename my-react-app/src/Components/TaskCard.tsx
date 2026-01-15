import React from "react";
import { Task } from "../App";

type TaskCardProps = {
    task: Task
    onDelete: (id: number) => void
};


export default function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{task.title}</h3>
      <h3 >{task.description}</h3>
      <h3 >{task.priority}</h3>
      <h3 >{task.dueDate}</h3>
      <p>
        Status:{" "}
        <strong>{task.completed ? "Completed" : "Not completed"}</strong>
      </p>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  title: {
    margin: 0,
  },
};
