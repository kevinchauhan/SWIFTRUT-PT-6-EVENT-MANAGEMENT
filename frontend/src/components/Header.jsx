import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const Header = () => {
    const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/logout`);
            logout(); // Clear the user state in Zustand
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="bg-white shadow-md text-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-semibold">
                    <Link to="/" className="hover:text-indigo-600">Recipe Management</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-gray-600 hover:text-indigo-600">Signup</Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
