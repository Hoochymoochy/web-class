import { useEffect, useState } from 'react';
import BlurText from "./../Components/BlurText";
import { useParams } from 'react-router-dom';

interface TaskAssignment {
    id: string;
    taskId: string;
    userId: string;
    assignedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface Task {
    id: string;                              
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';    
    dueDate: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'; 
    createdByUserId: string;
    teamId: string;
    assignments: TaskAssignment[];         
    comments: any[];
    createdAt: string;
    updatedAt: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    userId: string;
}

const PRIORITY_CONFIG = {
    HIGH:   { label: 'High',   color: 'bg-red-500' },
    MEDIUM: { label: 'Medium', color: 'bg-yellow-500' },
    LOW:    { label: 'Low',    color: 'bg-green-500' }
};

function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!userId || !token) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch tasks');

            const data = await response.json();
            setTasks(data.tasks || data || []); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching tasks');
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !dueDate || !priority) {
            setError('Please fill in all fields');
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setError('Authentication required');
            return;
        }

        try {
            setCreating(true);

            const payload = {
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate,
                createdByUserId: userId,
            };

            console.log(payload);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || 'Failed to create task');

            resetForm();
            setShowCreateModal(false);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating task');
        } finally {
            setCreating(false);
        }
    };

    const handleToggleStatus = async (taskId: string, currentStatus: Task['status']) => {
        const token = localStorage.getItem("token");
        if (!token) { setError('Authentication required'); return; }

        const nextStatus: Record<Task['status'], Task['status']> = {
            TODO: 'IN_PROGRESS',
            IN_PROGRESS: 'DONE',
            DONE: 'TODO'
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: nextStatus[currentStatus] })
            });

            if (!response.ok) throw new Error('Failed to update task');

            setOpenMenuId(null);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating task');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        const token = localStorage.getItem("token");
        if (!token) { setError('Authentication required'); return; }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setOpenMenuId(null);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting task');
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('HIGH');
        setDueDate('');
        setError('');
    };

    const closeModal = () => {
        setShowCreateModal(false);
        resetForm();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusLabel = (status: Task['status']) => {
        return { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[status];
    };

    const getStatusColor = (status: Task['status']) => {
        return {
            TODO: 'text-slate-400',
            IN_PROGRESS: 'text-blue-400',
            DONE: 'text-green-400'
        }[status];
    };

    return (
        <div className="flex justify-center flex-col items-center p-4 min-h-screen">
            <BlurText
                text="Personal Tasks"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-2xl mb-8"
            />

            <div className="w-full max-w-6xl">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="py-2 px-4 rounded mb-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                    Add Task <span className="ml-1">+</span>
                </button>

                {loading ? (
                    <p className="text-gray-400 text-center">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-gray-400 text-center">No tasks yet. Create one to get started!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`card-bg rounded-xl p-8 w-full shadow-2xl relative ${
                                    task.status === 'DONE' ? 'opacity-75' : ''
                                }`}
                            >
                                <div
                                    onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-700/30 rounded-lg transition-all cursor-pointer"
                                    title="Options"
                                >
                                    <span className='text-2xl'>⋮</span>
                                </div>

                                {openMenuId === task.id && (
                                    <div className="absolute top-14 right-4 flex flex-col gap-2 -hidden z-10">
                                        <button
                                            onClick={() => handleToggleStatus(task.id, task.status)}
                                            className="text-left px-4 py-2 text-green-400 hover:bg-slate-600 transition-colors text-sm"
                                        >
                                            {task.status === 'DONE' ? 'Mark To Do' : task.status === 'TODO' ? 'Mark In Progress' : 'Mark Done'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-left px-4 py-2 text-red-400 hover:bg-slate-600 transition-colors text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`${PRIORITY_CONFIG[task.priority].color} rounded-full w-2.5 h-2.5`} />
                                    <span className="text-slate-400 text-xs">{PRIORITY_CONFIG[task.priority].label}</span>
                                </div>

                                <h2 className={`text-2xl font-bold text-slate-100 mb-4 ${
                                    task.status === 'DONE' ? ' text-slate-400' : ''
                                }`}>
                                    {task.title}
                                </h2>

                                <p className="text-slate-400 text-sm">{task.description}</p>

                                <p className="text-slate-400 text-sm mt-3">
                                    {formatDate(task.dueDate)}
                                </p>

                                <p className={`text-sm mt-3 ${getStatusColor(task.status)}`}>
                                    {getStatusLabel(task.status)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-slate-100">Add Task</h2>

                        <form onSubmit={handleCreateTask} className="flex flex-col space-y-5">
                            <div className='space-y-3'>
                                <label className="block text-sm font-medium text-slate-300">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg outline-none"
                                    disabled={creating}
                                    autoFocus
                                    required
                                />

                                <label className="block text-sm font-medium text-slate-300">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    rows={3}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg outline-none resize-none"
                                    disabled={creating}
                                    required
                                />

                                <label className="block text-sm font-medium text-slate-300">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 text-slate-100 p-3 w-full rounded-lg outline-none"
                                    disabled={creating}
                                    required
                                />

                                <label className="block text-sm font-medium text-slate-300">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 text-slate-100 p-3 w-full rounded-lg outline-none"
                                    disabled={creating}
                                    required
                                >
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={creating}
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Adding...' : 'Add Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;