import { useEffect, useState } from 'react'

type Task = {
  id: number
  title: string
  description: string
  priority: string
  dueDate: string
  completed: boolean
}

const currentTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    prioirty: 1,
    dueDate: '2023-01-01',
    completedProperties: '2023-01-01',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 1',
    prioirty: 1,
    dueDate: '2023-01-01',
    completedProperties: '2023-01-01',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Description 1',
    prioirty: 1,
    dueDate: '2023-01-01',
    completedProperties: '2023-01-01',
  },
  {
    id: 4,
    title: 'Task 4',
    description: 'Description 1',
    prioirty: 1,
    dueDate: '2023-01-01',
    completedProperties: '2023-01-01',
  },
  {
    id: 5,
    title: 'Task 5',
    description: 'Description 1',
    prioirty: 1,
    dueDate: '2023-01-01',
    completedProperties: '2023-01-01',
  },
]

function App() {
  const [tasks, allTaks] = useState<Task[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    allTaks(currentTasks)
  }, [])

  const handleAddTask = () => {
    if(!title || !description || !priority || !dueDate) return
    const newTask: Task = {
      id: tasks.length + 1,
      title,
      description,
      priority,
      dueDate,
      completed: false,
    }
    allTaks([...tasks, newTask])
    setTitle('')
    setDescription('')
    setPriority('')
    setDueDate('')
  }

  const handleDeleteTask = (id: number) => {
    allTaks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="bg-black text-white p-4">

      <form className="flex flex-col gap-2">
        <input type="text" placeholder="Title" onInput={(e) => setTitle(e.target.value)}/>
        <input type="text" placeholder="Description" onInput={(e) => setDescription(e.target.value)}/>
        <input type="text" placeholder="Priority" onInput={(e) => setPriority(e.target.value)} />
        <input type="text" placeholder="Due Date" onInput={(e) => setDueDate(e.target.value)} />
        <button onClick={handleAddTask}>Add Task</button>

      </form>

      {tasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>{task.priority}</p>
          <p>{task.dueDate}</p>
          <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
        </div>
      ))}

    </div>
  )
}

export default App
