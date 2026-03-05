import { useEffect, useState } from 'react';
import BlurText from "./../Components/BlurText";

function TeamMembers() {
    const [members, setMembers] = useState([{ id: 1, name: 'John Doe', email: '9K2Gj@example.com' }, 
        { id: 2, name: 'Jane Doe', email: '9K2Gj@example.com' }, 
        { id: 3, name: 'John Doe', email: '9K2Gj@example.com' },
        { id: 4, name: 'Jane Doe', email: '9K2Gj@example.com' },
        ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setError('Authentication required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/team/members/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            setMembers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching members');
            console.error(err);
        } finally {
            setLoading(false);
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
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button className="text-white font-semibold py-2 px-4 rounded mb-4">Add Member <span className=''>+</span></button>

                {loading ? (
                    <p className="text-gray-400 text-center">Loading members...</p>
                ) : members.length === 0 ? (
                    <p className="text-gray-400 text-center">No team members found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member: any) => (
                            <div
                                key={member.id}
                                className="bg-black/60 rounded-lg p-6 hover:bg-black/50 transition"
                            >
                                <img
                                    src={'/user.png'}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full mb-4 object-cover bg-white/10"
                                />
                                <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                                <p className="text-gray-400 text-sm mb-1">{member.email}</p>
                                <p className="text-blue-400 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeamMembers;