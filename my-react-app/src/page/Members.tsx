import { useEffect, useState } from 'react';
import BlurText from "./../Components/BlurText";
import { useParams } from 'react-router-dom';


function TeamMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showCreateModal, setIsMenuOpen] = useState(false);
    const [gmail, setGmail] = useState('');

    const [creating, setCreating] = useState(false);
    const { teamId } = useParams();

    useEffect(() => {
        fetchMembers();
    }, []);

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

    const handlePromoteAdmin = async (userId: string) => {
        const token = localStorage.getItem("token");
    
        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3001/api/teams/promote/${userId}/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to promote member');
            }
    
            setOpenMenuId(null);
            await fetchMembers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error promoting member');
            console.error(err);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        const token = localStorage.getItem("token");

        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/teams/remove-member/${userId}/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove member');
            }

            setOpenMenuId(null);
            await fetchMembers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing member');
            console.error(err);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!gmail.trim()) {
            setError('Please enter an email');
            return;
        }

        const token = localStorage.getItem("token");

        if (!token || !teamId) {
            setError('Authentication required');
            return;
        }

        try {
            setCreating(true);
            setError('');
            const response = await fetch(`http://localhost:3001/api/teams/add-member`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_email: gmail,
                    team_id: teamId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add member');
            }

            setIsMenuOpen(false);
            setGmail('');
            await fetchMembers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error adding member');
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center p-4 min-h-screen">
            <BlurText
                text="Team Members"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-2xl mb-8"
            />

            <div className="w-full max-w-6xl">
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="py-2 px-4 rounded mb-4"
                >
                    Add Member <span>+</span>
                </button>

                {loading ? (
                    <p className="text-gray-400 text-center">Loading members...</p>
                ) : members.length === 0 ? (
                    <p className="text-gray-400 text-center">No team members found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member: any) => (
                            <div
                                key={member.id}
                                className="card-bg rounded-xl p-8 w-full shadow-2xl relative"
                            >
                                <div
                                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-700/30 rounded-lg transition-all cursor-pointer"
                                    title="Options"
                                >
                                    <span className='text-2xl'>:</span>
                                </div>

                                {openMenuId === member.id && (
                                    <div className="absolute top-14 right-4 flex flex-col gap-2">
                                        <button
                                            onClick={() => handlePromoteAdmin(member.userId)}
                                            className="text-green-500"
                                        >
                                            Promote to Admin
                                        </button>
                                        <button
                                            onClick={() => handleRemoveMember(member.userId)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                <img
                                    src={'/user.png'}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full mb-4 object-cover bg-white/10"
                                />
                                <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                                <p className="text-gray-400 text-sm mb-1">{member.email}</p>
                                <p className="text-blue-400 text-sm font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-slate-100">Add New Member</h2>
                        
                        <form onSubmit={handleAddMember} className="flex flex-col space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Member Email</label>
                                <input 
                                    type="email" 
                                    value={gmail}
                                    onChange={(e) => setGmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="bg-slate-700/30 border border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/50 text-slate-100 placeholder-slate-500 p-3 w-full rounded-lg transition-all duration-200 outline-none"
                                    disabled={creating}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setGmail('');
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
                                    className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg disabled:opacity-50 transition-all font-medium shadow-lg"
                                >
                                    {creating ? 'Adding...' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamMembers;