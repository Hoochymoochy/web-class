import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Header() {
    const { isAuthenticated, name, email, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
    <header>
        <nav className="absolute top-10 left-1/2 transform -translate-x-1/2 space-y-4 p-4 w-full max-w-md rounded-sm card-bg">
            <ul className="flex justify-center space-x-4">
                <li><Link to="/">Personal Tasks</Link></li>
                <li><Link to="/team">Teams</Link></li>
            </ul>
            {isAuthenticated && (
                <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm">
                    <span>{name || email || 'Signed in'}</span>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="underline hover:opacity-80"
                    >
                        Log out
                    </button>
                </div>
            )}
        </nav>
    </header>
    );
}

export default Header;
