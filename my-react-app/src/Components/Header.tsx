import { Link } from "react-router-dom";

function Header() {
    return (
    <header>
        <nav className="absolute top-10 left-1/2 transform -translate-x-1/2 space-y-4 p-4 w-full max-w-md rounded-sm card-bg">
            <ul className="flex justify-center space-x-4">
                <li><Link to="/">Personal Tasks</Link></li>
                <li><Link to="/team">Teams</Link></li>
            </ul>
        </nav>
    </header>
    );
}

export default Header;
