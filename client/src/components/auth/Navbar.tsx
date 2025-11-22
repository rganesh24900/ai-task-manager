import { NavLink } from "react-router-dom";
import Button from "../../common/components/Button";
import useLogout from "../../hooks/auth/useLogout";

const Navbar = () => {
    const {mutate:logoutFn} = useLogout()

    const logout = () => {
        logoutFn()
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-md font-medium transition-all ${isActive
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <nav className="w-full bg-[#fafafa] border-b px-6 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                AI Task Manager
            </h1>

            <div className="flex gap-4 items-center">
                <NavLink to="/" className={linkClass}>
                    Task List
                </NavLink>
                <NavLink to="/board" className={linkClass}>
                    Board
                </NavLink>
                <Button
                    variant="danger"
                    onClick={logout}
                    className="px-4 py-2"
                >
                    Logout
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
