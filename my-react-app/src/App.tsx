import { useEffect, useState } from 'react'
import Header from './Components/Header'
import TaskList from './Components/TaskList'

export type Task = {
  id: number
  title: string
  description: string
  priority: number
  dueDate: string
  completed: boolean
}

const currentTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    priority: 1,
    dueDate: '2023-01-01',
    completed: false,
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 1',
    priority: 2,
    dueDate: '2023-01-01',
    completed: false,
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Description 1',
    priority: 3,
    dueDate: '2023-01-01',
    completed: false,
  },
  {
    id: 4,
    title: 'Task 4',
    description: 'Description 1',
    priority: 3,
    dueDate: '2023-01-01',
    completed: false,
  },
  {
    id: 5,
    title: 'Task 5',
    description: 'Description 1',
    priority: 3,
    dueDate: '2023-01-01',
    completed: false,
  },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('tasks')
    return stored ? JSON.parse(stored) : []
  })
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<number | ''>('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddTask = () => {
    if (!title || !description || priority === '' || !dueDate) return

    const newTask: Task = {
      id: tasks.length + 1,
      title,
      description,
      priority,
      dueDate,
      completed: false,
    }

    setTasks(prev => [...prev, newTask])

    setTitle('')
    setDescription('')
    setPriority('')
    setDueDate('')
  }

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleCompleteTask = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return (
    <div className='flex justify-center flex-col items-center p-4'>
      <Header />

      {loading && <p>Loading...</p>}

      <form onSubmit={e => e.preventDefault()}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}/>
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
        <input type="number" placeholder="Priority" value={priority} onChange={e => setPriority(Number(e.target.value))} />
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
        <button type="button" onClick={handleAddTask}>Add Task</button>
      </form>

      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        handleCompleteTask={handleCompleteTask}
      />
    </div>
  )
}

export default App