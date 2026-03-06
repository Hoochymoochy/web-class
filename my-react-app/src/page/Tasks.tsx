import { useEffect, useState } from 'react';
import BlurText from "./../Components/BlurText";
import { useParams } from 'react-router-dom';

interface Task {
    id: number;
    title: string;
    description: string;
    priority: 1 | 2 | 3;
    dueDate: string;
    completed: boolean;
    assignedToId?: string;
    assignedToName?: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    userId: string;
}

const PRIORITY_CONFIG = {
    1: { label: 'High', color: 'bg-red-500' },
    2: { label: 'Mid', color: 'bg-yellow-500' },
    3: { label: 'Low', color: 'bg-green-500' }
};

function Tasks() {
    const { teamId } = useParams();
    
    // Task state
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Task 1', description: 'Description 1', priority: 1, dueDate: '2023-09-01', completed: false }
    ]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [assignedMembersModal, setAssignedMembersModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<1 | 2 | 3 | ''>(1);
    const [dueDate, setDueDate] = useState('');
    const [assignedToId, setAssignedToId] = useState('');

    useEffect(() => {
        fetchMembers();
        fetchTasks();
    }, [teamId]);

    const fetchMembers = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/teams/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            const transformedMembers = data.members.map((member: any) => ({
                id: member.id,
                name: member.user.name,
                email: member.user.email,
                role: member.role,
                userId: member.userId
            }));
            setMembers(transformedMembers);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching members');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!userId || !token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/teams/${teamId}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            setTasks(data.tasks || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching tasks');
            console.error(err);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !dueDate || !priority) {
            setError('Please fill in all fields');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            setCreating(true);
            const response = await fetch(`http://localhost:3001/api/teams/${teamId}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    priority: Number(priority),
                    dueDate,
                    completed: false,
                    assignedToId: assignedToId || null
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            resetForm();
            setShowCreateModal(false);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating task');
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleAssignMember = async (taskId: number, memberId: string) => {
        const token = localStorage.getItem("token");
        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/teams/${teamId}/tasks/${taskId}/assign`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ assignedToId: memberId })
            });

            if (!response.ok) {
                throw new Error('Failed to assign task');
            }

            setOpenMenuId(null);
            setAssignedMembersModal(false);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error assigning task');
            console.error(err);
        }
    };

    const handleToggleComplete = async (taskId: number, currentStatus: boolean) => {
        const token = localStorage.getItem("token");
        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/teams/${teamId}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !currentStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            setOpenMenuId(null);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating task');
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        const token = localStorage.getItem("token");
        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/teams/${teamId}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            setOpenMenuId(null);
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting task');
            console.error(err);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority(1);
        setDueDate('');
        setAssignedToId('');
        setError('');
    };

    const closeModal = () => {
        setShowCreateModal(false);
        resetForm();
    };

    const getPriorityColor = (priority: 1 | 2 | 3) => {
        return PRIORITY_CONFIG[priority].color;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getAssignedMemberName = (memberId?: string) => {
        if (!memberId) return 'Unassigned';
        const member = members.find(m => m.userId === memberId);
        return member ? member.name : 'Unknown';
    };

    return (
        <div className="flex justify-center flex-col items-center p-4 min-h-screen">
            <BlurText
                text="Team Tasks"
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
                                    task.completed ? 'opacity-75' : ''
                                }`}
                            >
                                {/* Menu Button */}
                                <div
                                    onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-700/30 rounded-lg transition-all cursor-pointer"
                                    title="Options"
                                >
                                    <span className='text-2xl'>:</span>
                                </div>

                                {/* Dropdown Menu */}
                                {openMenuId === task.id && (
                                    <div className="absolute top-14 right-4 flex flex-col gap-2 bg-slate-700 border border-slate-600 rounded-lg shadow-xl overflow-hidden z-10">
                                        <button
                                            onClick={() => {
                                                setSelectedTaskId(task.id);
                                                setAssignedMembersModal(true);
                                            }}
                                            className="text-left px-4 py-2 text-blue-500 hover:bg-slate-600 transition-colors text-sm"
                                        >
                                            Assign Member
                                        </button>
                                        <button
                                            onClick={() => handleToggleComplete(task.id, task.completed)}
                                            className="text-left px-4 py-2 text-green-500 hover:bg-slate-600 transition-colors text-sm"
                                        >
                                            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-left px-4 py-2 text-red-500 hover:bg-slate-600 transition-colors text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {/* Task Content */}
                                <h2 className={`text-2xl font-bold text-slate-100 mb-4 ${
                                    task.completed ? 'line-through text-slate-400' : ''
                                }`}>
                                    {task.title}
                                </h2>

                                <p className="text-slate-400 text-sm">
                                    {task.description}
                                </p>

                                <p className="text-slate-400 text-sm mt-3">
                                    {formatDate(task.dueDate)}
                                </p>

                                <p className="text-slate-400 text-sm mt-3">
                                    <span className="text-slate-300 font-medium">Assigned to: </span>
                                    {getAssignedMemberName(task.assignedToId)}
                                </p>

                                <p className="text-slate-400 text-sm mt-3">
                                    {task.completed ? "✓ Completed" : "In Progress"}
                                </p>

                                <p className="text-slate-400 text-sm mt-3">
                                    {
                                        task.priority === 1 && <div className={`${getPriorityColor(task.priority)} rounded-full p-2`}></div>
                                    }
                                    {
                                        task.priority === 2 && <div className={`${getPriorityColor(task.priority)} rounded-full p-2`}></div>
                                    }
                                    {
                                        task.priority === 3 && <div className={`${getPriorityColor(task.priority)} rounded-full p-2`}></div>
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-slate-100">Add Task</h2>
                        
                        <form onSubmit={handleCreateTask} className="flex flex-col space-y-5">
                            <div className='space-y-3'>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="title"
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg transition-all duration-200 outline-none"
                                    disabled={creating}
                                    autoFocus
                                    required
                                />

                                <label className="block text-sm font-medium text-slate-300 mb-3">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="description"
                                    rows={3}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg transition-all duration-200 outline-none resize-none"
                                    disabled={creating}
                                    required
                                />

                                <label className="block text-sm font-medium text-slate-300 mb-3">Due Date</label>
                                <input 
                                    type="date" 
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg transition-all duration-200 outline-none"
                                    disabled={creating}
                                    required
                                />

                                <label className="block text-sm font-medium text-slate-300 mb-3">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 p-3 w-full rounded-lg transition-all duration-200 outline-none"
                                    disabled={creating}
                                    required
                                >
                                    <option value={1}>High</option>
                                    <option value={2}>Mid</option>
                                    <option value={3}>Low</option>
                                </select>

                                <label className="block text-sm font-medium text-slate-300 mb-3">Assign To (Optional)</label>
                                <select
                                    value={assignedToId}
                                    onChange={(e) => setAssignedToId(e.target.value)}
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 p-3 w-full rounded-lg transition-all duration-200 outline-none"
                                    disabled={creating}
                                >
                                    <option value="">Unassigned</option>
                                    {members.map((member) => (
                                        <option key={member.userId} value={member.userId}>
                                            {member.name}
                                        </option>
                                    ))}
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

            {/* Assign Member Modal */}
            {assignedMembersModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-slate-100">Assign Member</h2>
                        
                        <div className="flex flex-col space-y-3">
                            {members.map((member) => (
                                <button
                                    key={member.userId}
                                    onClick={() => {
                                        if (selectedTaskId) {
                                            handleAssignMember(selectedTaskId, member.userId);
                                        }
                                    }}
                                    className="text-left px-4 py-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 transition-colors border border-slate-600/50 hover:border-slate-500"
                                >
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-slate-400">{member.email}</div>
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    if (selectedTaskId) {
                                        handleAssignMember(selectedTaskId, '');
                                    }
                                }}
                                className="text-left px-4 py-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 text-slate-400 transition-colors border border-slate-600/50 hover:border-slate-500 mt-2"
                            >
                                <div className="font-medium">Unassigned</div>
                            </button>
                        </div>

                        <div className="flex gap-3 justify-end pt-6">
                            <button 
                                onClick={() => setAssignedMembersModal(false)}
                                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;