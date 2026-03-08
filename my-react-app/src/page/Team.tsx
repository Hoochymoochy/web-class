import { useEffect, useState } from 'react';
import BlurText from "./../Components/BlurText";

function Team() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        console.log(userId + '\n' + token);

        if (!userId || !token) {
            setError('Authentication required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teams/member/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teams');
            }

            const data = await response.json();
            setTeams(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching teams');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setError('Authentication required');
            return;
        }

        if (!teamName.trim()) {
            setError('Team name is required');
            return;
        }

        if (teamName.trim().length < 2) {
            setError('Team name must be at least 2 characters');
            return;
        }

        if (teamName.trim().length > 50) {
            setError('Team name must be less than 50 characters');
            return;
        }

        try {
            setCreating(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    name: teamName.trim()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create team');
            }

            setTeamName('');
            setShowCreateModal(false);
            setError('');
            await fetchTeams();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating team');
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center p-4 min-h-screen ">
            <BlurText
                text="Manage your team"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-3xl mb-12 font-light tracking-tight"
            />

            <div className="card-bg rounded-xl p-8 w-full max-w-4xl shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg text-slate-300 font-medium">Your Teams</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className=""
                    >
                        <span className="text-lg">+</span> Create Team
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400 animate-pulse">Loading teams...</p>
                    </div>
                ) : teams.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400 text-lg mb-2">No teams yet</p>
                        <p className="text-slate-500 text-sm">Create your first team to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wide">Team Name</th>
                                    <th className="px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wide">Members</th>
                                    <th className="px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wide">Tasks</th>
                                    <th className="px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((team: any) => (
                                    <tr key={team.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-150">
                                        <td className="px-6 py-4 text-slate-100 font-medium">{team.name}</td>
                                        <td className="px-6 py-4">
                                            <a href={`/team/${team.id}/members`} className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                                View Members
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`/team/${team.id}/tasks`} className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                                View Tasks
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 cursor-pointer hover:text-slate-200">⋮</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-serif mb-6 text-slate-100">Create New Team</h2>
                        
                        <form onSubmit={handleCreateTeam} className="flex flex-col space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Team Name</label>
                                <input 
                                    type="text" 
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Enter team name"
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg transition-all duration-200 outline-none"
                                    disabled={creating}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setTeamName('');
                                        setError('');
                                    }}
                                    disabled={creating}
                                    className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/40 disabled:opacity-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={creating}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg disabled:opacity-50 transition-all font-medium shadow-lg"
                                >
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Team;