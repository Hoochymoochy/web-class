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

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  useEffect(() => {
    setLoading(false)
  }, [])
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<number | ''>('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(true)

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
            {loading && <p>Loading...</p>}

    </div>
  )
}

export default App