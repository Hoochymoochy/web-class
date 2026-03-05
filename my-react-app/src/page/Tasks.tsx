import { useEffect, useState } from 'react';
import BlurText from "./../Components/BlurText";

function Team() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setError('Authentication required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/team/${userId}`, {
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

    const handleAddTeam = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create team');
            }

            // Refresh teams list
            await fetchTeams();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating team');
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center p-4 min-h-screen">
            <BlurText
                text="Manage your team"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-2xl mb-8"
            />

            <div className="bg-black/60 rounded-lg p-6 w-full max-w-4xl">
                <button
                    onClick={handleAddTeam}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6 flex items-center gap-2"
                >
                    Create Team <span className="text-xl">+</span>
                </button>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {loading ? (
                    <p className="text-gray-400">Loading teams...</p>
                ) : teams.length === 0 ? (
                    <p className="text-gray-400">No teams yet. Create one to get started!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="px-4 py-2">Team Name</th>
                                    <th className="px-4 py-2">Members</th>
                                    <th className="px-4 py-2">Tasks</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((team: any) => (
                                    <tr key={team.id} className="border-b border-gray-700 hover:bg-black/40">
                                        <td className="px-4 py-2">{team.name}</td>
                                        <td className="px-4 py-2">
                                            <a href="/team/members" className="text-blue-400 hover:underline">
                                                View Members
                                            </a>
                                        </td>
                                        <td className="px-4 py-2">
                                            <a href="/team/tasks" className="text-blue-400 hover:underline">
                                                View Tasks
                                            </a>
                                        </td>
                                        <td className="px-4 py-2">⋮</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Team;