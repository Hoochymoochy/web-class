
function Header() {
    return <header>
        <nav className="bg-gradient-to-r from-green-500 to-black opacity-75 p-4 rounded-b-lg mb-4 rounded-t-lg ">
            <ul className="flex justify-center space-x-4">
                <li><a className="text-gray-300 font-bold border-b-2 border-gray-300" href="/">Home</a></li>
                <li><a className="text-gray-300 font-bold border-b-2 border-gray-300" href="/">About</a></li>
                <li><a className="text-gray-300 font-bold border-b-2 border-gray-300" href="/">Settings</a></li>
                <li><a className="text-gray-300 font-bold border-b-2 border-gray-300" href="/">Help</a></li>

            </ul>
        </nav>


    </header>;
}

export default Header;
