import { Link } from "react-router-dom";

function Header() {
    return <header>
        <nav className="bg-linear-to-r from-green-500 to-black opacity-75 p-4 rounded-b-lg mb-4 rounded-t-lg ">
            <ul className="flex justify-center space-x-4">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    </header>;
}

export default Header;
