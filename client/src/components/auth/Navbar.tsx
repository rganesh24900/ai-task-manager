import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "../../common/components/Button";
import useLogout from "../../hooks/auth/useLogout";

const Navbar = () => {
    const { mutate: logoutFn } = useLogout();
    const [open, setOpen] = useState(false);

    const logout = () => logoutFn();

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-md font-medium transition-all block ${isActive
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <nav className="w-full bg-[#fafafa] border-b px-6 py-3 flex justify-between items-center relative">
            {/* Logo */}
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                AI Task Manager
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-4 items-center">
                <NavLink to="/" className={linkClass}>
                    Task List
                </NavLink>
                <NavLink to="/board" className={linkClass}>
                    Board
                </NavLink>
                <Button variant="danger" onClick={logout} className="px-4 py-2">
                    Logout
                </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setOpen(!open)}
            >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Dropdown */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-white border-b shadow-md md:hidden p-4 flex flex-col gap-3 z-50">
                    <NavLink
                        to="/"
                        onClick={() => setOpen(false)}
                        className={linkClass}
                    >
                        Task List
                    </NavLink>

                    <NavLink
                        to="/board"
                        onClick={() => setOpen(false)}
                        className={linkClass}
                    >
                        Board
                    </NavLink>

                    <Button
                        variant="danger"
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="w-full py-2"
                    >
                        Logout
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
